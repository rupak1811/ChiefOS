"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import GlassCard from "@/components/GlassCard";
import { Send, ArrowLeft, Bot } from "lucide-react";

interface ChatMessage {
  id: string;
  role: string;
  content: string;
  createdAt: string;
  agent?: {
    id: string;
    name: string;
    avatarColor: string;
  } | null;
}

interface ChatThread {
  id: string;
  title?: string | null;
  agent?: {
    id: string;
    name: string;
    title?: string | null;
    avatarColor: string;
  } | null;
  messages: ChatMessage[];
}

interface PageProps {
  params: Promise<{ slug: string; threadId: string }>;
}

export default function ChatThreadPage({ params }: PageProps) {
  const router = useRouter();
  const [slug, setSlug] = useState<string>("");
  const [threadId, setThreadId] = useState<string>("");
  const [thread, setThread] = useState<ChatThread | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    params.then(({ slug: resolvedSlug, threadId: resolvedThreadId }) => {
      setSlug(resolvedSlug);
      setThreadId(resolvedThreadId);
      fetchThread(resolvedThreadId);
    });
  }, [params]);

  useEffect(() => {
    scrollToBottom();
  }, [thread?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchThread = async (id: string) => {
    try {
      const res = await fetch(`/api/chat/threads/${id}`);
      const data = await res.json();
      setThread(data);
    } catch (error) {
      console.error("Failed to fetch thread:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || sending) return;

    const userMessage = message;
    setMessage("");
    setSending(true);

    try {
      const res = await fetch(`/api/chat/threads/${threadId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: userMessage }),
      });

      if (res.ok) {
        const { userMessage: newUserMsg, agentMessage } = await res.json();
        setThread((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            messages: [
              ...prev.messages,
              newUserMsg,
              ...(agentMessage ? [agentMessage] : []),
            ],
          };
        });
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-foreground/60">Loading conversation...</p>
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-foreground/60">Thread not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.push(`/app/p/${slug}/chat`)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        {thread.agent ? (
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: thread.agent.avatarColor }}
            >
              {thread.agent.name.charAt(0)}
            </div>
            <div>
              <h2 className="font-bold">{thread.agent.name}</h2>
              {thread.agent.title && (
                <p className="text-sm text-accent-teal">{thread.agent.title}</p>
              )}
            </div>
          </div>
        ) : (
          <h2 className="font-bold">Chat</h2>
        )}
      </div>

      {/* Messages */}
      <GlassCard className="flex-1 p-6 overflow-y-auto mb-4">
        <div className="space-y-4">
          {thread.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <Bot className="w-16 h-16 text-foreground/40 mb-4" />
              <p className="text-foreground/60">
                Start a conversation with {thread.agent?.name || "your agent"}
              </p>
            </div>
          ) : (
            thread.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
              >
                {msg.role === "agent" && msg.agent && (
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                    style={{ backgroundColor: msg.agent.avatarColor }}
                  >
                    {msg.agent.name.charAt(0)}
                  </div>
                )}
                <div
                  className={`px-4 py-3 rounded-2xl max-w-[70%] ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-accent-teal to-accent-blue text-white"
                      : "glass-morphism"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <p className="text-xs opacity-60 mt-1">
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          )}
          {sending && (
            <div className="flex gap-3">
              {thread.agent && (
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  style={{ backgroundColor: thread.agent.avatarColor }}
                >
                  {thread.agent.name.charAt(0)}
                </div>
              )}
              <div className="px-4 py-3 rounded-2xl glass-morphism">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-accent-teal rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-accent-teal rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-accent-teal rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </GlassCard>

      {/* Input */}
      <form onSubmit={handleSend} className="flex gap-3">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          disabled={sending}
          className="flex-1 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-accent-teal focus:outline-none disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!message.trim() || sending}
          className="px-6 h-14 rounded-2xl bg-gradient-to-r from-accent to-accent-hover text-[#070B14] hover:shadow-lg hover:shadow-accent/25 hover:-translate-y-0.5 hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-2"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
