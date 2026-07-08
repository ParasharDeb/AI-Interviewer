import { WebSocketServer } from "ws";
import { GoogleGenAI, Modality } from "@google/genai";

const wss = new WebSocketServer({
  port: 5050,
});

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

wss.on("connection", async (socket) => {
  console.log("Frontend connected");

  // Create ONE Gemini session for this client
  const session = await ai.live.connect({
    model: "gemini-3.1-flash-live-preview",

    config: {
      responseModalities: [Modality.AUDIO],
    },

    callbacks: {
      onopen() {
        console.log("Gemini connected");
      },

      onmessage(message) {
        console.log("Gemini:", message);
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