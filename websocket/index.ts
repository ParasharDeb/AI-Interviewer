import { WebSocketServer } from "ws";
import { GoogleGenAI, Modality } from "@google/genai";

const wss = new WebSocketServer({
  port: 5050,
});

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

wss.on("connection", async (socket,req) => {
  console.log("Frontend connected");
  const url = new URL(req.url!, "http://localhost");

  const interviewId = url.searchParams.get("interviewId");

  console.log(interviewId);
  // Create ONE Gemini session for this client
  const session = await ai.live.connect({
    model: "gemini-3.1-flash-live-preview",
    config: {
        responseModalities: [Modality.AUDIO],
        systemInstruction: process.env.GEMINI_PROMPT!
        },

    callbacks: {
      onopen() {
        console.log("Gemini connected");
      },

      onmessage(message) {
        const content = message.serverContent;
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

  // Receive audio from browser
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