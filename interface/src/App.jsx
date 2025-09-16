import React, { useEffect } from "react";
import Sidebar from "./components/Sidebar";
import { Route, Routes, useParams } from "react-router-dom";
import ChatBox from "./components/ChatBox";
import Credits from "./pages/Credits";
import Community from "./pages/Community";
import { useAppContext } from "./context/AppContext";
import "./assets/prism.css";
import Auth from "./pages/Login";
import Loading from "./pages/Loading";

function ChatPage() {
  const { chatId } = useParams();
  const { setSelectedChat } = useAppContext();

  useEffect(() => {
    setSelectedChat(chatId ?? null);
  }, [chatId, setSelectedChat]);

  return <ChatBox />;
}

export default function App() {
  const { user } = useAppContext();
  return (
    <div
      className="min-h-screen w-screen text-fg"
      style={{ background: "var(--gradient-bg)" }}
    >
      {user ? (
        <div className="flex h-screen w-full">
          <Sidebar />
          <Routes>
            <Route path="/" element={<ChatBox />} />
            <Route path="/chat/:chatId" element={<ChatPage />} />
            <Route path="/credits" element={<Credits />} />
            <Route path="/community" element={<Community />} />
            <Route path="/loading" element={<Loading />} />
          </Routes>
        </div>
      ) : (
        <div className="relative min-h-screen w-full grid place-items-center overflow-hidden bg-bg">
          {/* faint grid */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
              backgroundSize: "28px 28px",
              color: "oklch(0.21 0.02 255)",
              maskImage:
                "radial-gradient(ellipse at 50% 10%, black 40%, transparent 75%)",
            }}
          />

          {/* glow blobs */}
          <div
            aria-hidden
            className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-primary/25 blur-3xl"
          />
          <div
            aria-hidden
            className="absolute -bottom-28 -right-24 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl"
          />

          {/* glass card */}
          <div className="w-full max-w-5xl mx-4 rounded-3xl border border-border/30 bg-bg/60 backdrop-blur-xl shadow-xl">
            <Auth />
          </div>
        </div>
      )}
    </div>
  );
}
