import 'dotenv/config'
import { WebSocketServer } from "ws";
import { GoogleGenAI, Modality } from "@google/genai";
import { client } from '@repo/redis';
import { prisma } from "@repo/db";
interface InterviewType{
  InterviewID:string,
  Messages:Messagetype[]
}
interface Messagetype{
  Sender:"AI"|"CLIENT",
  Messages:string
}
const wss = new WebSocketServer({
  port: 5050,
});
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});
wss.on("connection", async (socket,req) => {
  
  const InterviewMessages:Messagetype[]=[]
  let aimessage=""
  console.log("Frontend connected");
  const url = new URL(req.url!, "http://localhost");
  const interviewId = url.searchParams.get("interviewId");
  const role = url.searchParams.get("role") || "General";
  if(!interviewId){
    return
  }
  const githubmetadata=await prisma.interview.findFirst({
    where:{
      id:interviewId
    }
  })
  function InterviewMaker(){
    const finalPrompt=`You are a senior level ${role} at a software company. You need to take a ${role} interview ${process.env.GEMINI_PROMPT!}. The user's githubdata ${githubmetadata}.The interview should end within 10 mins structure the questions like that.` 
    return finalPrompt
  }
  const session = await ai.live.connect({
    model: "gemini-3.1-flash-live-preview",
    config: {
        responseModalities: [Modality.AUDIO],
        systemInstruction:InterviewMaker()
        },

    callbacks: {
      onopen() {
        console.log("Gemini connected");
      },

      async onmessage(message) {
        const content = message.serverContent;
        if(!content) return
        if(content.inputTranscription?.text){
          InterviewMessages.push({
            Sender:"CLIENT",
            Messages:content.inputTranscription.text
          })
          await client.rpush(
  `interview:${interviewId}:messages`,
  JSON.stringify({
    sender: "CLIENT",
    message: content.inputTranscription.text,
  })
);
          
        }
        if(content.outputTranscription?.text){
          aimessage=aimessage+content.outputTranscription.text 
        }
        if(content.turnComplete){
          
            InterviewMessages.push({
              Sender:'AI',
              Messages:aimessage
            })
            
            await client.rpush(
  `interview:${interviewId}:messages`,
  JSON.stringify({
    sender: "AI",
    message: aimessage,
  })
);
aimessage=""
          }
          socket.send(
            JSON.stringify({
            type:"Message list",
            data:InterviewMessages
          }))
        if (content?.modelTurn?.parts) {
        for (const part of content.modelTurn.parts) {
        if (part.inlineData) {
            socket.send(
                JSON.stringify({
                    type: "audio",
                    data: part.inlineData.data
                })
            );

        }

    }
}
if (content?.outputTranscription) {
  
    socket.send(
        JSON.stringify({
            type: "transcript",
            text: content.outputTranscription.text
        })
    );
}
      },

      onerror(error) {
        console.error("Gemini error:", error);
      },

      onclose(event) {
        console.log("Gemini closed:", event.reason);
      },
    },
  });

  console.log("Gemini session started");


  socket.on("message", (data) => {
    const buffer = data as Buffer;
    
    session.sendRealtimeInput({
      audio: {
        data: buffer.toString("base64"),
        mimeType: "audio/pcm;rate=16000",
      },
    });

  });

  socket.on("close", () => {
    console.log("Frontend disconnected");
    session.close();
  });

  socket.on("error", (err) => {
    console.error(err);
    session.close();
  });
});