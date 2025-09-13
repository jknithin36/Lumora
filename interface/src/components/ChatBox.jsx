// src/components/ChatBox.jsx
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import Message from "./Message";
import { Image as ImageIcon, Send } from "lucide-react";

const ChatBox = () => {
  const { selectedChat } = useAppContext();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const next =
      (selectedChat &&
        Array.isArray(selectedChat.messages) &&
        selectedChat.messages) ||
      [];
    setMessages(next);
  }, [selectedChat]);

  const isEmpty = messages.length === 0;

  return (
    <div className="flex-1 flex flex-col bg-bg text-fg">
      {/* Scroll area */}
      <div className="relative flex-1 overflow-y-auto">
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
                             backdrop-blur-sm
                             border border-white/20 shadow-sm
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

              {/* colorful suggestion chips */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
                {[
                  {
                    label: "Summarize this PDF",
                    cls: "text-sky-700 border-sky-200 hover:bg-sky-50 focus-visible:ring-sky-400",
                  },
                  {
                    label: "Explain this error",
                    cls: "text-amber-700 border-amber-200 hover:bg-amber-50 focus-visible:ring-amber-400",
                  },
                  {
                    label: "Improve this paragraph",
                    cls: "text-emerald-700 border-emerald-200 hover:bg-emerald-50 focus-visible:ring-emerald-400",
                  },
                  {
                    label: "Create image prompt",
                    cls: "text-fuchsia-700 border-fuchsia-200 hover:bg-fuchsia-50 focus-visible:ring-fuchsia-400",
                  },
                ].map(({ label, cls }) => (
                  <button
                    key={label}
                    type="button"
                    className={`rounded-full px-3 py-1.5 text-xs font-medium border bg-muted/60 backdrop-blur transition 
                                focus-visible:outline-none focus-visible:ring-2 ${cls}`}
                    aria-label={label}
                    title={label}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* faint grid — only in empty state */}
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
            messages.map((m, i) => <Message key={i} message={m} />)
          )}
        </div>
      </div>

      {/* Input Bar */}
      <form
        className="sticky bottom-0 inset-x-0 bg-bg/85 border-t border-muted-foreground/15 backdrop-blur supports-[backdrop-filter]:bg-bg/60"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="mx-auto max-w-3xl px-3 sm:px-4 py-3">
          <div className="flex items-end gap-2">
            <div className="flex items-center w-full rounded-2xl border border-muted-foreground/20 bg-muted/70 focus-within:ring-2 focus-within:ring-primary/35 transition">
              <button
                type="button"
                aria-label="Attach image"
                title="Attach image"
                className="p-2 text-muted-foreground hover:text-primary transition"
              >
                <ImageIcon className="h-5 w-5" />
              </button>

              <textarea
                rows={1}
                placeholder="Message Lumora…"
                aria-label="Message input"
                className="flex-1 max-h-48 min-h-[48px] resize-none bg-transparent px-2 py-3 text-sm leading-6 outline-none"
              />

              <button
                type="submit"
                aria-label="Send"
                title="Send"
                className="flex items-center justify-center h-10 w-10 mr-1 rounded-full text-primary hover:bg-primary/10 transition"
              >
                <Send className="h-5 w-5" strokeWidth={2.2} />
              </button>
            </div>
          </div>

          <div className="mt-1 text-[11px] text-center text-muted-foreground">
            Lumora can make mistakes. Consider checking important info.
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChatBox;
