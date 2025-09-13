// src/components/Sidebar.jsx
import React, { useMemo, useRef, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets, dummyChats, dummyUserData } from "../assets/assets";
import { Button } from "./ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  UsersRound,
  Diamond,
  MessageSquare,
  Trash,
  ChevronRight,
  PanelLeftOpen,
  PanelLeftClose,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const GAP_Y = "gap-2.5";

function isNumber(v) {
  return typeof v === "number" && Number.isFinite(v);
}
function safeTs(v) {
  const n = +new Date(v);
  return Number.isFinite(n) ? n : null;
}

const Sidebar = () => {
  const navigate = useNavigate();
  const {
    selectedChatId,
    setSelectedChat,
    deleteChat,
    user: ctxUser,
    logout,
  } = useAppContext();

  const user = ctxUser || dummyUserData;
  const chats = dummyChats;

  const [search, setSearch] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  const searchRef = useRef(null);

  const trunc = (t = "", n = 36) => (t.length > n ? t.slice(0, n) + "…" : t);

  const latestTs = (c) => {
    const last = c?.messages?.at?.(-1)?.timestamp ?? null;
    const fromLast = isNumber(last) ? last : safeTs(last);
    const fromUpdated = safeTs(c?.updatedAt);
    const fromCreated = safeTs(c?.createdAt);
    return fromLast ?? fromUpdated ?? fromCreated ?? null; // null if truly unknown
  };

  const filteredChats = useMemo(() => {
    // filter
    const q = search.toLowerCase().trim();
    const list = q
      ? chats.filter((c) => {
          const first = c?.messages?.[0]?.content || "";
          return `${c?.name ?? ""} ${first}`.toLowerCase().includes(q);
        })
      : chats.slice();

    // sort by latest timestamp desc; unknown timestamps go to the bottom
    return list.sort((a, b) => {
      const ta = latestTs(a);
      const tb = latestTs(b);
      if (ta === tb) return 0;
      if (ta === null) return 1;
      if (tb === null) return -1;
      return tb - ta;
    });
  }, [chats, search]);

  const isClient = typeof window !== "undefined";
  const isMobileWidth = () =>
    isClient && typeof window.matchMedia === "function"
      ? window.matchMedia("(max-width: 767px)").matches
      : false;

  const handleNewChat = () => {
    setSelectedChat && setSelectedChat(null);
    if (isMobileWidth()) setCollapsed(true);
  };

  const handleRowActivate = (chatId) => {
    // set selection first (in case route transition unmounts)
    setSelectedChat && setSelectedChat(chatId);
    navigate("/");
    if (isMobileWidth()) setCollapsed(true);
  };

  return (
    <>
      {/* MOBILE-ONLY opener when collapsed */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          aria-label="Open sidebar"
          className="md:hidden fixed top-3 left-3 z-40 rounded-md p-2 bg-bg/80 border border-muted-foreground/20 shadow hover:bg-muted-foreground/10 transition"
        >
          <PanelLeftOpen className="h-4 w-4" />
        </button>
      )}

      <aside
        className={cn(
          "relative flex h-screen flex-col bg-muted text-fg border-r border-muted-foreground/20 transition-all duration-300",
          collapsed ? "w-14" : "w-64"
        )}
      >
        {/* Header */}
        <div className={cn("pt-3 px-3", collapsed ? "pb-1" : "pb-3")}>
          <div
            className={cn(
              "flex items-center",
              collapsed ? "justify-center" : "justify-between"
            )}
          >
            <img
              src={assets.logo}
              alt="Lumora"
              className={cn(
                "object-contain",
                collapsed ? "h-8 w-auto" : "h-14 w-auto"
              )}
            />
            {!collapsed && (
              <button
                onClick={() => setCollapsed(true)}
                title="Collapse"
                aria-label="Collapse"
                className="rounded-md p-1 hover:bg-muted-foreground/10 transition focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <PanelLeftClose className="h-4 w-4" />
              </button>
            )}
          </div>

          {collapsed && (
            <div className="mt-2 hidden md:flex justify-center">
              <button
                onClick={() => setCollapsed(false)}
                title="Expand"
                aria-label="Expand"
                className="rounded-full p-2 hover:bg-muted-foreground/10 transition focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <PanelLeftOpen className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Actions / Search */}
        <div className={cn("px-3", collapsed && "px-2")}>
          {collapsed ? (
            <div className={cn("flex flex-col items-stretch md:flex", GAP_Y)}>
              <button
                onClick={handleNewChat}
                className="rounded-md p-2 hover:bg-muted-foreground/10 transition focus-visible:ring-2 focus-visible:ring-primary/40"
                title="New chat"
                aria-label="New chat"
              >
                <Plus className="h-5 w-5 mx-auto" />
              </button>

              <button
                onClick={() => {
                  setCollapsed(false);
                  // autofocus after expansion
                  setTimeout(() => searchRef.current?.focus(), 0);
                }}
                className="rounded-md p-2 hover:bg-muted-foreground/10 transition focus-visible:ring-2 focus-visible:ring-primary/40"
                title="Search chats"
                aria-label="Search chats"
              >
                <Search className="h-5 w-5 mx-auto text-muted-foreground" />
              </button>
            </div>
          ) : (
            <div className={cn("flex flex-col", GAP_Y)}>
              <Button
                onClick={handleNewChat}
                className="w-full flex items-center justify-center gap-2"
              >
                <Plus className="h-4 w-4" />
                New Chat
              </Button>

              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  ref={searchRef}
                  type="search"
                  placeholder="Search conversations"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8"
                  aria-label="Search conversations"
                />
              </div>

              <div className="text-xs uppercase tracking-wide text-muted-foreground mt-1">
                Recent chats
              </div>
            </div>
          )}
        </div>

        {/* Chats list */}
        {!collapsed ? (
          <div className="flex-1 overflow-y-auto pr-1">
            <div className={cn("px-3", GAP_Y)}>
              {filteredChats.length ? (
                filteredChats.map((c, idx) => {
                  const title = trunc(
                    c?.messages?.[0]?.content || c?.name || "Untitled"
                  );
                  const active = c?._id === selectedChatId;
                  const ts = latestTs(c);
                  const tsTitle = ts
                    ? moment(ts).format("YYYY-MM-DD HH:mm:ss")
                    : "";
                  const tsText = ts ? moment(ts).fromNow() : "";

                  const chatId = c?._id ?? `row-${idx}`;

                  return (
                    <button
                      type="button"
                      key={chatId}
                      onClick={() => handleRowActivate(c._id)}
                      className={cn(
                        "group w-full rounded-md transition-colors cursor-pointer text-left focus-visible:ring-2 focus-visible:ring-primary/40",
                        active
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted-foreground/10"
                      )}
                      aria-current={active ? "page" : undefined}
                    >
                      <div className="flex items-center justify-between px-2 py-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <MessageSquare className="h-4 w-4 shrink-0" />
                          <span className="truncate text-sm">{title}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {tsText && (
                            <span
                              className={cn(
                                "text-xs",
                                active ? "opacity-90" : "text-muted-foreground"
                              )}
                              title={tsTitle}
                            >
                              {tsText}
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (deleteChat && c?._id) deleteChat(c._id);
                            }}
                            className={cn(
                              "rounded p-1 transition focus-visible:ring-2 focus-visible:ring-primary/40",
                              active
                                ? "opacity-90 hover:bg-white/10"
                                : "opacity-0 group-hover:opacity-100 hover:bg-muted-foreground/10"
                            )}
                            aria-label="Delete chat"
                            title="Delete chat"
                          >
                            <Trash
                              className={cn(
                                "h-4 w-4",
                                active
                                  ? ""
                                  : "text-muted-foreground hover:text-red-500"
                              )}
                            />
                          </button>
                        </div>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="text-sm text-muted-foreground py-6 text-center">
                  No chats
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1" />
        )}

        {/* Footer */}
        <div className="sticky bottom-0 inset-x-0 bg-muted border-t border-muted-foreground/20">
          <div className={cn("p-2", GAP_Y, collapsed && "space-y-1")}>
            <button
              onClick={() =>
                collapsed ? setCollapsed(false) : navigate("/community")
              }
              className={cn(
                "w-full rounded-md hover:bg-muted-foreground/10 transition focus-visible:ring-2 focus-visible:ring-primary/40",
                collapsed
                  ? "p-2 flex items-center justify-center"
                  : "px-3 py-2 flex items-center justify-between"
              )}
              title="Community Images"
            >
              <span className="flex items-center gap-2">
                <UsersRound className="h-5 w-5" />
                {!collapsed && (
                  <span className="text-sm">Community Images</span>
                )}
              </span>
              {!collapsed && (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </button>

            <button
              onClick={() =>
                collapsed ? setCollapsed(false) : navigate("/credits")
              }
              className={cn(
                "w-full rounded-md hover:bg-muted-foreground/10 transition focus-visible:ring-2 focus-visible:ring-primary/40",
                collapsed
                  ? "p-2 flex items-center justify-center"
                  : "px-3 py-2 flex items-center justify-between"
              )}
              title="Credits"
            >
              <span className="flex items-center gap-2">
                <Diamond className="h-5 w-5 text-yellow-500" />
                {!collapsed && (
                  <span className="text-sm">
                    Credits
                    {typeof user?.credits === "number"
                      ? ` · ${user.credits}`
                      : ""}
                  </span>
                )}
              </span>
              {!collapsed && (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </button>

            <div
              className={cn(
                "rounded-md bg-muted-foreground/5",
                collapsed
                  ? "p-2 flex items-center justify-center gap-2"
                  : "px-3 py-2 flex items-center justify-between"
              )}
            >
              <div className="flex items-center gap-3">
                <img
                  src={user?.avatar || assets.user_icon}
                  alt="User"
                  className="h-8 w-8 rounded-full object-cover"
                  title={user?.name || "User"}
                  onError={(e) => {
                    try {
                      e.currentTarget.src = assets.user_icon;
                    } catch {
                      console.log();
                    }
                  }}
                />
                {!collapsed && (
                  <div className="min-w-0">
                    <div className="text-sm truncate">
                      {user?.name || "Guest"}
                    </div>
                    {user?.email && (
                      <div className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </div>
                    )}
                  </div>
                )}
              </div>
              {!collapsed && (
                <button
                  onClick={() => logout && logout()}
                  className="rounded-md p-2 hover:bg-muted-foreground/10 transition focus-visible:ring-2 focus-visible:ring-primary/40"
                  title="Log out"
                  aria-label="Log out"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
