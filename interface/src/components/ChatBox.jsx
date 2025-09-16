// // src/components/ChatBox.jsx
// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { assets, dummyChats } from "@/assets/assets";
// import { useAppContext } from "@/context/AppContext";
// import Message from "./Message";
// import { Image as ImageIcon, Send } from "lucide-react";
// import { useParams } from "react-router-dom";

// function isChatObject(x) {
//   return x && typeof x === "object" && Array.isArray(x.messages);
// }

// // Tiny typing animation component (three dots)
// function TypingDots() {
//   return (
//     <>
//       {/* Inline styles for the typing animation */}
//       <style>
//         {`
//         @keyframes chatDot {
//           0% { opacity: .2; transform: translateY(0); }
//           20% { opacity: 1; transform: translateY(-2px); }
//           40% { opacity: .2; transform: translateY(0); }
//         }
//         .chat-dot {
//           width: .4rem;
//           height: .4rem;
//           border-radius: 9999px;
//           background: currentColor;
//           display: inline-block;
//           margin: 0 .2rem;
//           animation: chatDot 1.2s infinite ease-in-out;
//         }
//         .chat-dot:nth-child(2) { animation-delay: .15s; }
//         .chat-dot:nth-child(3) { animation-delay: .3s; }
//       `}
//       </style>

//       <div className="flex items-center gap-1 text-fg/85">
//         <span className="chat-dot" />
//         <span className="chat-dot" />
//         <span className="chat-dot" />
//       </div>
//     </>
//   );
// }

// export default function ChatBox() {
//   const { selectedChat, chats: ctxChats } = useAppContext();
//   const { chatId: routeChatId } = useParams();
//   const scrollRef = useRef(null);

//   // Prefer chats from context; else fallback to dummy
//   const chats =
//     Array.isArray(ctxChats) && ctxChats.length ? ctxChats : dummyChats;

//   // Determine active chat:
//   // 1) If selectedChat is an object with messages, use it.
//   // 2) Else if selectedChat is an id (string) or we have a :chatId in URL, find it in chats.
//   const activeChat = useMemo(() => {
//     if (isChatObject(selectedChat)) return selectedChat;

//     const id =
//       (selectedChat && typeof selectedChat === "string" && selectedChat) ||
//       routeChatId ||
//       null;

//     if (!id) return null;
//     return chats.find((c) => c?._id === id) || null;
//   }, [selectedChat, routeChatId, chats]);

//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(false); // ← loading state
//   const [input, setInput] = useState("");

//   useEffect(() => {
//     setMessages(activeChat?.messages ?? []);
//   }, [activeChat]);

//   // Auto-scroll to bottom on new messages or loading changes
//   useEffect(() => {
//     const el = scrollRef.current;
//     if (!el) return;
//     el.scrollTop = el.scrollHeight + 1000;
//   }, [messages, loading]);

//   const isEmpty = !activeChat || messages.length === 0;

//   // Optional: a minimal submit handler that just flips loading on.
//   // Wire this up to your real API; call setLoading(true) before request
//   // and setLoading(false) after you append the assistant message.
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const text = input.trim();
//     if (!text) return;

//     // 1) push the user message into the local view
//     const next = {
//       _id: `local-${Date.now()}`,
//       role: "user",
//       content: text,
//       timestamp: Date.now(),
//     };
//     setMessages((m) => [...m, next]);
//     setInput("");
//     setLoading(true);

//     // 2) 🔌 TODO: call your API here. When your assistant reply arrives:
//     // setMessages((m) => [...m, assistantMsg]);
//     // setLoading(false);

//     // Demo only (remove): fake assistant reply after 1.2s
//     // setTimeout(() => {
//     //   const assistantMsg = {
//     //     _id: `local-assistant-${Date.now()}`,
//     //     role: "assistant",
//     //     content: "Thanks! I’m thinking about that…",
//     //     timestamp: Date.now(),
//     //   };
//     //   setMessages((m) => [...m, assistantMsg]);
//     //   setLoading(false);
//     // }, 1200);
//   };

//   return (
//     <div className="flex-1 flex flex-col bg-bg text-fg">
//       {/* Scroll area */}
//       <div ref={scrollRef} className="relative flex-1 overflow-y-auto">
//         <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />

//         <div className="relative z-10 mx-auto w-full max-w-3xl px-4 pt-6 pb-28 space-y-4">
//           {isEmpty ? (
//             <div className="relative mx-auto max-w-2xl pt-20 pb-10 text-center">
//               {/* ambient blobs */}
//               <div
//                 className="pointer-events-none absolute -top-24 -left-28 h-56 w-56 rounded-full blur-3xl opacity-40"
//                 style={{
//                   background:
//                     "radial-gradient(closest-side, oklch(0.78 0.14 280 / .35), transparent)",
//                 }}
//               />
//               <div
//                 className="pointer-events-none absolute -bottom-24 -right-24 h-48 w-48 rounded-full blur-3xl opacity-35"
//                 style={{
//                   background:
//                     "radial-gradient(closest-side, oklch(0.74 0.12 180 / .35), transparent)",
//                 }}
//               />

//               {/* brand chip */}
//               <div className="mb-6 inline-flex items-center gap-3 justify-center">
//                 <img
//                   src={assets.logo}
//                   alt="Lumora"
//                   className="h-9 w-9 sm:h-10 sm:w-10 rounded-md object-contain ring-1 ring-muted-foreground/10 shadow-sm"
//                 />
//                 <span
//                   className="text-[11px] md:text-xs font-medium px-3 py-1.5 rounded-full
//                              backdrop-blur-sm
//                              border border-white/20 shadow-sm
//                              text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-primary"
//                 >
//                   fast · focused · helpful
//                 </span>
//               </div>

//               {/* headline */}
//               <h1 className="text-3xl sm:text-[2.25rem] font-semibold tracking-tight leading-tight">
//                 <span
//                   className="bg-gradient-to-r from-white via-[oklch(0.75_0.05_250)] to-[oklch(0.35_0.12_250)]
//                              bg-clip-text text-transparent
//                              [background-size:200%_100%] motion-safe:animate-[gradientShift_6s_ease-in-out_infinite]"
//                 >
//                   Ask anything.
//                 </span>{" "}
//                 Get a clear answer.
//               </h1>

//               {/* accent line */}
//               <div className="mx-auto mt-3 h-[2px] w-20 rounded-full bg-gradient-to-r from-primary/60 to-transparent relative overflow-hidden">
//                 <span className="absolute inset-y-0 w-10 bg-gradient-to-r from-transparent via-white/60 to-transparent motion-safe:animate-[shimmer_1.4s_linear_infinite]" />
//               </div>

//               {/* subcopy */}
//               <p className="mt-3 text-sm sm:text-base text-muted-foreground">
//                 Draft, debug, or brainstorm. Lumora turns rough ideas into
//                 usable text, code, and images with minimal fuss.
//               </p>

//               {/* colorful suggestion chips */}
//               <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
//                 {[
//                   {
//                     label: "Summarize this PDF",
//                     cls: "text-sky-700 border-sky-200 hover:bg-sky-50 focus-visible:ring-sky-400",
//                   },
//                   {
//                     label: "Explain this error",
//                     cls: "text-amber-700 border-amber-200 hover:bg-amber-50 focus-visible:ring-amber-400",
//                   },
//                   {
//                     label: "Improve this paragraph",
//                     cls: "text-emerald-700 border-emerald-200 hover:bg-emerald-50 focus-visible:ring-emerald-400",
//                   },
//                   {
//                     label: "Create image prompt",
//                     cls: "text-fuchsia-700 border-fuchsia-200 hover:bg-fuchsia-50 focus-visible:ring-fuchsia-400",
//                   },
//                 ].map(({ label, cls }) => (
//                   <button
//                     key={label}
//                     type="button"
//                     className={`rounded-full px-3 py-1.5 text-xs font-medium border bg-muted/60 backdrop-blur transition
//                                 focus-visible:outline-none focus-visible:ring-2 ${cls}`}
//                     aria-label={label}
//                     title={label}
//                   >
//                     {label}
//                   </button>
//                 ))}
//               </div>

//               {/* faint grid */}
//               <div
//                 className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06]"
//                 style={{
//                   backgroundImage:
//                     "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
//                   backgroundSize: "28px 28px",
//                   color: "oklch(0.21 0.02 255)",
//                   maskImage:
//                     "radial-gradient(ellipse at 50% 10%, black 40%, transparent 75%)",
//                 }}
//               />
//             </div>
//           ) : (
//             <>
//               {messages.map((m, i) => (
//                 <Message key={m._id || i} message={m} />
//               ))}

//               {/* Typing loader bubble (assistant side) */}
//               {loading && (
//                 <div className="flex w-full justify-start">
//                   <img
//                     src={assets.logo}
//                     alt="Assistant"
//                     className="mr-2 h-7 w-7 shrink-0 rounded-md object-contain bg-muted p-1"
//                   />
//                   <div className="max-w-[80%]">
//                     <div className="rounded-2xl bg-muted text-fg px-4 py-2 shadow-sm">
//                       <TypingDots />
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </div>

//       {/* Input Bar */}
//       <form
//         className="sticky bottom-0 inset-x-0 bg-bg/85 border-t border-muted-foreground/15 backdrop-blur supports-[backdrop-filter]:bg-bg/60"
//         onSubmit={handleSubmit}
//       >
//         <div className="mx-auto max-w-3xl px-3 sm:px-4 py-3">
//           <div className="flex items-end gap-2">
//             <div className="flex items-center w-full rounded-2xl border border-muted-foreground/20 bg-muted/70 focus-within:ring-2 focus-within:ring-primary/35 transition">
//               <button
//                 type="button"
//                 aria-label="Attach image"
//                 title="Attach image"
//                 className="p-2 text-muted-foreground hover:text-primary transition"
//               >
//                 <ImageIcon className="h-5 w-5" />
//               </button>

//               <textarea
//                 rows={1}
//                 placeholder="Message Lumora…"
//                 aria-label="Message input"
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 className="flex-1 max-h-48 min-h-[48px] resize-none bg-transparent px-2 py-3 text-sm leading-6 outline-none"
//               />

//               <button
//                 type="submit"
//                 aria-label="Send"
//                 title="Send"
//                 disabled={loading}
//                 className="flex items-center justify-center h-10 w-10 mr-1 rounded-full text-primary hover:bg-primary/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <Send className="h-5 w-5" strokeWidth={2.2} />
//               </button>
//             </div>
//           </div>

//           <div className="mt-1 text-[11px] text-center text-muted-foreground">
//             Lumora can make mistakes. Consider checking important info.
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// }
// src/components/ChatBox.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { assets, dummyChats } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import Message from "./Message";
import { Send, Square } from "lucide-react";
import { useParams } from "react-router-dom";

function isChatObject(x) {
  return x && typeof x === "object" && Array.isArray(x.messages);
}

/** Tiny typing animation (three dots) */
function TypingDots() {
  return (
    <>
      <style>
        {`
        @keyframes chatDot {
          0% { opacity: .2; transform: translateY(0); }
          20% { opacity: 1; transform: translateY(-2px); }
          40% { opacity: .2; transform: translateY(0); }
        }
        .chat-dot {
          width: .4rem; height: .4rem; border-radius: 9999px;
          background: currentColor; display: inline-block; margin: 0 .2rem;
          animation: chatDot 1.2s infinite ease-in-out;
        }
        .chat-dot:nth-child(2) { animation-delay: .15s; }
        .chat-dot:nth-child(3) { animation-delay: .3s; }
      `}
      </style>
      <div className="flex items-center gap-1 text-fg/85">
        <span className="chat-dot" />
        <span className="chat-dot" />
        <span className="chat-dot" />
      </div>
    </>
  );
}

export default function ChatBox() {
  const { selectedChat, chats: ctxChats } = useAppContext();
  const { chatId: routeChatId } = useParams();

  const scrollRef = useRef(null);
  const textareaRef = useRef(null);

  // --- UI state ---
  const [mode, setMode] = useState("text"); // "text" | "image"
  const [isPublished, setIsPublished] = useState(false); // image-only toggle
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isComposing, setIsComposing] = useState(false); // IME safe enter

  // Prefer chats from context; else fallback to dummy
  const chats =
    Array.isArray(ctxChats) && ctxChats.length ? ctxChats : dummyChats;

  // Determine active chat
  const activeChat = useMemo(() => {
    if (isChatObject(selectedChat)) return selectedChat;
    const id =
      (selectedChat && typeof selectedChat === "string" && selectedChat) ||
      routeChatId ||
      null;
    if (!id) return null;
    return chats.find((c) => c?._id === id) || null;
  }, [selectedChat, routeChatId, chats]);

  const [messages, setMessages] = useState([]);
  useEffect(() => setMessages(activeChat?.messages ?? []), [activeChat]);

  // Auto-scroll to bottom on new messages/loading
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight + 1000;
  }, [messages, loading]);

  // Auto-resize textarea up to 200px
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "0px";
    ta.style.height = Math.min(ta.scrollHeight, 200) + "px";
  }, [input]);

  const isEmpty = !activeChat || messages.length === 0;
  const canSend = !loading && input.trim().length > 0;

  // --- Submit / Stop ---
  const stopHandle = useRef(() => {});
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSend) return;

    const text = input.trim();
    setInput("");

    // Push user message
    setMessages((m) => [
      ...m,
      {
        _id: `local-${Date.now()}`,
        role: "user",
        content: text,
        timestamp: Date.now(),
      },
    ]);

    setLoading(true);

    // TODO: replace with your real API call using { text, mode, isPublished }
    const t = setTimeout(() => {
      const assistantMsg =
        mode === "image"
          ? {
              _id: `asst-${Date.now()}`,
              role: "assistant",
              isImage: true,
              content: "https://picsum.photos/seed/lumora/1000/560",
              timestamp: Date.now(),
              meta: { published: isPublished },
            }
          : {
              _id: `asst-${Date.now()}`,
              role: "assistant",
              content: `You said: **${text}**\n\nMode: \`${mode}\`\nPublished: \`${isPublished}\``,
              timestamp: Date.now(),
              meta: { published: isPublished },
            };
      setMessages((m) => [...m, assistantMsg]);
      setLoading(false);
    }, 1100);

    stopHandle.current = () => {
      clearTimeout(t);
      setLoading(false);
    };
  };

  const handleStop = () => stopHandle.current?.();

  // Enter to send, Shift+Enter newline, Cmd/Ctrl+Enter send; IME-safe
  const handleKeyDown = (e) => {
    if (isComposing) return;
    const isCmdEnter = (e.metaKey || e.ctrlKey) && e.key === "Enter";
    if (isCmdEnter || (e.key === "Enter" && !e.shiftKey)) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-bg text-fg">
      {/* Scroll area */}
      <div ref={scrollRef} className="relative flex-1 overflow-y-auto">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="relative z-10 mx-auto w-full max-w-3xl px-4 pt-6 pb-28 space-y-4">
          {isEmpty ? (
            <div className="relative mx-auto max-w-2xl pt-20 pb-10 text-center">
              {/* ambient blobs */}
              <div
                className="pointer-events-none absolute -top-24 -left-28 h-56 w-56 rounded-full blur-3xl opacity-40"
                style={{
                  background:
                    "radial-gradient(closest-side, oklch(0.78 0.14 280 / .35), transparent)",
                }}
              />
              <div
                className="pointer-events-none absolute -bottom-24 -right-24 h-48 w-48 rounded-full blur-3xl opacity-35"
                style={{
                  background:
                    "radial-gradient(closest-side, oklch(0.74 0.12 180 / .35), transparent)",
                }}
              />

              {/* brand chip */}
              <div className="mb-6 inline-flex items-center gap-3 justify-center">
                <img
                  src={assets.logo}
                  alt="Lumora"
                  className="h-9 w-9 sm:h-10 sm:w-10 rounded-md object-contain ring-1 ring-muted-foreground/10 shadow-sm"
                />
                <span
                  className="text-[11px] md:text-xs font-medium px-3 py-1.5 rounded-full
                             backdrop-blur-sm border border-white/20 shadow-sm
                             text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-primary"
                >
                  fast · focused · helpful
                </span>
              </div>

              {/* headline */}
              <h1 className="text-3xl sm:text-[2.25rem] font-semibold tracking-tight leading-tight">
                <span
                  className="bg-gradient-to-r from-white via-[oklch(0.75_0.05_250)] to-[oklch(0.35_0.12_250)]
                             bg-clip-text text-transparent
                             [background-size:200%_100%] motion-safe:animate-[gradientShift_6s_ease-in-out_infinite]"
                >
                  Ask anything.
                </span>{" "}
                Get a clear answer.
              </h1>

              {/* accent line */}
              <div className="mx-auto mt-3 h-[2px] w-20 rounded-full bg-gradient-to-r from-primary/60 to-transparent relative overflow-hidden">
                <span className="absolute inset-y-0 w-10 bg-gradient-to-r from-transparent via-white/60 to-transparent motion-safe:animate-[shimmer_1.4s_linear_infinite]" />
              </div>

              {/* subcopy */}
              <p className="mt-3 text-sm sm:text-base text-muted-foreground">
                Draft, debug, or brainstorm. Lumora turns rough ideas into
                usable text, code, and images with minimal fuss.
              </p>

              {/* suggestion chips */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
                {[
                  "Summarize this PDF",
                  "Explain this error",
                  "Improve this paragraph",
                  "Create image prompt",
                ].map((label) => (
                  <button
                    key={label}
                    type="button"
                    className="rounded-full px-3 py-1.5 text-xs font-medium border bg-muted/60 backdrop-blur transition
                               text-fg/80 border-border hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    onClick={() => setInput((s) => (s ? s : label + " — "))}
                    aria-label={label}
                    title={label}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* faint grid */}
              <div
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
            </div>
          ) : (
            <>
              {messages.map((m, i) => (
                <Message key={m._id || i} message={m} />
              ))}

              {/* assistant typing bubble */}
              {loading && (
                <div className="flex w-full justify-start">
                  <img
                    src={assets.logo}
                    alt="Assistant"
                    className="mr-2 h-7 w-7 shrink-0 rounded-md object-contain bg-muted p-1"
                  />
                  <div className="max-w-[80%]">
                    <div className="rounded-2xl bg-muted text-fg px-4 py-2 shadow-sm">
                      <TypingDots />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modern Prompt Bar */}
      <form
        onSubmit={handleSubmit}
        className="sticky bottom-0 inset-x-0 bg-gradient-to-t from-bg/95 to-bg/60 backdrop-blur-xl border-t border-border/20"
      >
        <div className="mx-auto max-w-3xl px-3 sm:px-4 py-4">
          {/* Image-only publish toggle (above the pill) */}
          {mode === "image" && (
            <label className="mb-3 flex items-center gap-2 text-sm text-muted-foreground select-none">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="h-4 w-4 rounded accent-primary"
              />
              <span>Publish Generated Image to Community</span>
            </label>
          )}

          {/* One rounded pill: [select] | [textarea] | [send/stop] */}
          <div
            className="flex items-center gap-3 rounded-full
                       bg-muted/70 backdrop-blur-md px-4 py-3
                       border border-border/30 shadow-sm
                       focus-within:ring-2 focus-within:ring-primary/40
                       transition"
          >
            {/* Mode dropdown */}
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              aria-label="Mode"
              className="text-sm bg-transparent outline-none border-none cursor-pointer"
            >
              <option className="dark:bg-neutral-900" value="text">
                Text
              </option>
              <option className="dark:bg-neutral-900" value="image">
                Image
              </option>
            </select>

            {/* Divider */}
            <span className="select-none text-border/50">|</span>

            {/* Prompt */}
            <textarea
              ref={textareaRef}
              rows={1}
              placeholder="Type your prompt here…"
              aria-label="Prompt"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={() => setIsComposing(false)}
              autoComplete="off"
              className="flex-1 min-h-[1.5rem] max-h-[200px] resize-none bg-transparent text-sm leading-6 outline-none placeholder:text-muted-foreground"
            />

            {/* Send / Stop */}
            {!loading ? (
              <button
                type="submit"
                disabled={!canSend}
                title="Send"
                aria-label="Send"
                className="h-10 w-10 shrink-0 inline-flex items-center justify-center
                           rounded-full bg-primary text-primary-foreground shadow-md
                           hover:opacity-90 transition
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-5 w-5" strokeWidth={2.2} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStop}
                title="Stop generating"
                aria-label="Stop generating"
                className="h-10 w-10 shrink-0 inline-flex items-center justify-center
                           rounded-full bg-destructive/90 text-white shadow-md
                           hover:bg-destructive transition"
              >
                <Square className="h-5 w-5" strokeWidth={2.4} />
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
