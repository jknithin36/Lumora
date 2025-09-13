import React from "react";
import Sidebar from "./components/Sidebar";
import { Route, Routes } from "react-router-dom";
import ChatBox from "./components/ChatBox";
import Credits from "./pages/Credits";
import Community from "./pages/Community";

export default function App() {
  return (
    <div
      className="min-h-screen w-screen text-fg"
      style={{ background: "var(--gradient-bg)" }}
    >
      <div className="flex h-screen w-full">
        <Sidebar />
        <Routes>
          <Route path="/" element={<ChatBox />} />
          <Route path="/credits" element={<Credits />} />
          <Route path="/community" element={<Community />} />
        </Routes>
      </div>
    </div>
  );
}
