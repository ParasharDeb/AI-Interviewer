
import { useEffect, useRef, useState } from "react";
import { Send, User, Sun, Moon, Mic } from "lucide-react";


import { MediaHandler } from "@/handlers/media-handler";
import { InterviewSocket } from "@/handlers/interview-socket";
type Message = {
  sender: "me" | "ai";
  text: string;
};

type AiState = "idle" | "thinking" | "speaking";


export default function InterviewPage() {

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const sessionRef = useRef<any>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: "Whenever you're ready, tell me a bit about yourself and the role you're preparing for.",
    },
  ]);
  const [input, setInput] = useState("");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [aiState, setAiState] = useState<AiState>("idle");

  const isDark = theme === "dark";


  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, aiState]);

  function sendMessage() {
    const text = input.trim();
    if (!text) return;

    setMessages((prev) => [...prev, { sender: "me", text }]);
    setInput("");
    setAiState("thinking");

    // Placeholder for real-time backend wiring, e.g.:
    // socket.current?.send(JSON.stringify({ type: "message", text }));

    const thinkDelay = 900 + Math.random() * 700;
    // window.setTimeout(() => {
    //   const reply = AI_REPLIES[Math.floor(Math.random() * AI_REPLIES.length)];
    //   setAiState("speaking");
    //   setMessages((prev) => [...prev, { sender: "ai", text: reply }]);

    //   const speakDuration = 1800 + reply.length * 25;
    //   window.setTimeout(() => setAiState("idle"), speakDuration);
    // }, thinkDelay);
  }
useEffect(() => {
  const mediaHandler = new MediaHandler();
  const socket  = new InterviewSocket({
    onOpen: () => {
    console.log("Connected to backend");
  },

  onMessage: (event) => {
    

    const msg = JSON.parse(event.data);

    if (msg.type === "transcript") {
        console.log(msg.text);
    }

    if (msg.type === "audio") {
        
        console.log(msg.text)
    }

  },

  onClose: () => {
    console.log("Closed");
  },

  onError: (err) => {
    console.error(err);
  },
  });
  socket.connect()
  async function init() {
    await mediaHandler.startAudio((pcm:any) => {
      socket.sendAudio(pcm)
    });
  }

  init();

  return () => {
    mediaHandler.stopAudio();
    socket.disconnect()
  };
}, []);
  // ---- theme tokens -------------------------------------------------
  const bg = isDark ? "#0a0a0c" : "#eceeef";
  const panel = isDark ? "#131316" : "#ffffff";
  const panelAlt = isDark ? "#18181b" : "#f4f4f5";
  const border = isDark ? "#28282d" : "#dcdce0";
  const textPrimary = isDark ? "#f4f4f5" : "#18181b";
  const textMuted = isDark ? "#8b8b93" : "#71717a";
  const bubbleMe = isDark ? "#3f3f46" : "#18181b";
  const bubbleMeText = "#f4f4f5";
  const bubbleAi = isDark ? "#1e1e23" : "#f4f4f5";
  const bubbleAiText = isDark ? "#e4e4e7" : "#27272a";

  return (
    <div
      style={{ background: bg, color: textPrimary }}
      className="min-h-screen p-4 sm:p-8 transition-colors duration-500"
    >
      <style>{`
        @keyframes blobMorph {
          0%   { border-radius: 42% 58% 65% 35% / 45% 45% 55% 55%; }
          25%  { border-radius: 60% 40% 30% 70% / 50% 62% 38% 50%; }
          50%  { border-radius: 35% 65% 55% 45% / 62% 40% 60% 38%; }
          75%  { border-radius: 58% 42% 40% 60% / 40% 55% 45% 60%; }
          100% { border-radius: 42% 58% 65% 35% / 45% 45% 55% 55%; }
        }
        @keyframes blobPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.045); }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.08); }
        }
        @keyframes barWave {
          0%, 100% { transform: scaleY(0.25); }
          50% { transform: scaleY(1); }
        }
        @keyframes dotBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-4px); opacity: 1; }
        }
        .blob-shape {
          animation: blobMorph 9s ease-in-out infinite;
        }
        .blob-shape.speaking {
          animation: blobMorph 4.5s ease-in-out infinite, blobPulse 1.1s ease-in-out infinite;
        }
        .blob-glow {
          animation: glowPulse 6s ease-in-out infinite;
        }
        .blob-glow.speaking {
          animation: glowPulse 1.4s ease-in-out infinite;
        }
        .bar {
          animation: barWave 1s ease-in-out infinite;
          transform-origin: center;
        }
        .dot {
          animation: dotBounce 1.2s infinite;
        }
      `}</style>

      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Interview</h1>
            <p className="text-sm mt-1" style={{ color: textMuted }}>
              Live mock session
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div
              className="flex items-center gap-2 rounded-full px-4 py-2 text-sm"
              style={{ background: panelAlt, border: `1px solid ${border}` }}
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              Connected
            </div>

            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              aria-label="Toggle theme"
              className="flex items-center justify-center h-10 w-10 rounded-full transition-colors"
              style={{ background: panelAlt, border: `1px solid ${border}` }}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>

        {/* Video Panels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div
            className="rounded-3xl p-4 transition-colors duration-500"
            style={{ background: panel, border: `1px solid ${border}` }}
          >
            <h2
              className="mb-3 text-xs font-semibold tracking-[0.15em] uppercase"
              style={{ color: textMuted }}
            >
              You
            </h2>

            <div
              className="aspect-video rounded-2xl flex items-center justify-center"
              style={{
                background: isDark
                  ? "linear-gradient(135deg, #27272a, #0a0a0c)"
                  : "linear-gradient(135deg, #e4e4e7, #f4f4f5)",
              }}
            >
              <User size={72} style={{ color: textMuted }} />
            </div>
          </div>

          <div
            className="rounded-3xl p-4 transition-colors duration-500"
            style={{ background: panel, border: `1px solid ${border}` }}
          >
            <div className="mb-3 flex items-center justify-between">
              <h2
                className="text-xs font-semibold tracking-[0.15em] uppercase"
                style={{ color: textMuted }}
              >
                AI Interviewer
              </h2>
              <span className="text-xs" style={{ color: textMuted }}>
                {aiState === "thinking" ? "thinking…" : aiState === "speaking" ? "speaking" : "listening"}
              </span>
            </div>

            <div
              className="aspect-video rounded-2xl flex flex-col items-center justify-center gap-5 relative overflow-hidden"
              style={{
                background: isDark
                  ? "radial-gradient(circle at 50% 40%, #1c1c20, #08080a)"
                  : "radial-gradient(circle at 50% 40%, #ffffff, #e4e4e7)",
              }}
            >
              {/* outer glow */}
              <div
                className={`blob-glow ${aiState === "speaking" ? "speaking" : ""} absolute rounded-full blur-2xl`}
                style={{
                  width: 150,
                  height: 150,
                  background: isDark
                    ? "radial-gradient(circle, rgba(255,255,255,0.35), transparent 70%)"
                    : "radial-gradient(circle, rgba(24,24,27,0.25), transparent 70%)",
                }}
              />

              {/* blob */}
              <div
                className={`blob-shape ${aiState === "speaking" ? "speaking" : ""} relative`}
                style={{
                  width: 110,
                  height: 110,
                  background: isDark
                    ? "linear-gradient(145deg, #f4f4f5, #52525b 55%, #18181b)"
                    : "linear-gradient(145deg, #3f3f46, #a1a1aa 55%, #e4e4e7)",
                  boxShadow: isDark
                    ? "0 0 40px rgba(255,255,255,0.12), inset 0 0 20px rgba(0,0,0,0.4)"
                    : "0 0 30px rgba(0,0,0,0.15), inset 0 0 20px rgba(255,255,255,0.3)",
                }}
              />

              {/* voice bars */}
              <div className="relative flex items-end gap-1 h-6">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="bar w-1 rounded-full"
                    style={{
                      height: aiState === "speaking" ? 22 : aiState === "thinking" ? 10 : 6,
                      background: textMuted,
                      animationDelay: `${i * 0.12}s`,
                      animationPlayState: aiState === "speaking" ? "running" : "paused",
                      opacity: aiState === "idle" ? 0.4 : 1,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Chat */}
        <div
          className="rounded-3xl flex flex-col h-[500px] transition-colors duration-500"
          style={{ background: panel, border: `1px solid ${border}` }}
        >
          <div
            className="p-5 text-xl font-semibold"
            style={{ borderBottom: `1px solid ${border}` }}
          >
            Conversation
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className="max-w-xl rounded-2xl px-5 py-3 text-[15px] leading-relaxed"
                  style={{
                    background: msg.sender === "me" ? bubbleMe : bubbleAi,
                    color: msg.sender === "me" ? bubbleMeText : bubbleAiText,
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {aiState === "thinking" && (
              <div className="flex justify-start">
                <div
                  className="rounded-2xl px-5 py-4 flex items-center gap-1.5"
                  style={{ background: bubbleAi }}
                >
                  <span className="dot h-1.5 w-1.5 rounded-full" style={{ background: textMuted, animationDelay: "0s" }} />
                  <span className="dot h-1.5 w-1.5 rounded-full" style={{ background: textMuted, animationDelay: "0.2s" }} />
                  <span className="dot h-1.5 w-1.5 rounded-full" style={{ background: textMuted, animationDelay: "0.4s" }} />
                </div>
              </div>
            )}
          </div>

          <div className="p-5 flex gap-4" style={{ borderTop: `1px solid ${border}` }}>
            <input
              className="flex-1 rounded-xl px-5 py-3 outline-none transition-colors"
              style={{
                background: panelAlt,
                color: textPrimary,
                border: `1px solid ${border}`,
              }}
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
            />

            <button
              onClick={sendMessage}
              aria-label="Send message"
              className="rounded-xl px-6 flex items-center justify-center transition-transform active:scale-95"
              style={{ background: isDark ? "#f4f4f5" : "#18181b", color: isDark ? "#18181b" : "#f4f4f5" }}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}



