// src/components/Message.jsx
import { assets } from "@/assets/assets";
import React, { useEffect } from "react";
import moment from "moment";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypePrism from "rehype-prism-plus";
import "@/assets/prism.css";

const Message = ({ message }) => {
  const isUser = message?.role === "user";
  const isImage = !!message?.isImage;

  if (!message) return null;

  // Format timestamps
  const ts = message?.timestamp ? moment(message.timestamp) : null;
  const relative = ts ? ts.fromNow() : "";
  const full = ts ? ts.format("MMM D, YYYY • h:mm A") : "";

  return (
    <div
      className={
        isUser ? "flex w-full justify-end" : "flex w-full justify-start"
      }
    >
      {/* Assistant avatar (left) */}
      {!isUser && (
        <img
          src={assets.logo}
          alt="Assistant"
          className="mr-2 h-7 w-7 shrink-0 rounded-md object-contain bg-muted p-1"
        />
      )}

      {/* Bubble */}
      <div className="max-w-[80%]">
        {isImage ? (
          <div className="rounded-xl overflow-hidden border border-muted-foreground/15 bg-muted">
            <img
              src={message.content}
              alt="AI generated"
              className="block h-auto max-h-[420px] w-full object-cover"
            />
          </div>
        ) : (
          <div
            className={
              isUser
                ? "rounded-2xl bg-primary text-primary-foreground px-4 py-2 shadow-sm"
                : "rounded-2xl bg-muted text-fg px-4 py-2 shadow-sm"
            }
          >
            {/* Markdown content */}
            <div
              className="prose prose-invert max-w-none text-sm leading-relaxed
                         prose-pre:!bg-transparent prose-pre:!p-0
                         prose-code:before:content-[''] prose-code:after:content-['']"
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypePrism]}
              >
                {String(message.content ?? "")}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {/* Timestamp */}
        {ts && (
          <div className="mt-1 text-[11px] text-muted-foreground" title={full}>
            {relative}
          </div>
        )}
      </div>

      {/* User avatar (right) */}
      {isUser && (
        <img
          src={assets.user_icon}
          alt="You"
          className="ml-2 h-7 w-7 shrink-0 rounded-full object-cover"
        />
      )}
    </div>
  );
};

export default Message;
