"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import GlassCard from "@/components/GlassCard";
import Reveal from "@/components/motion/Reveal";
import { MessageSquare, Plus, Bot, Send, ArrowLeft } from "lucide-react";

interface ChatThread {
  id: string;
  title?: string | null;
  createdAt: string;
  updatedAt: string;
  agent?: {
    id: string;
    name: string;
    title?: string | null;
    avatarColor: string;
  } | null;
  project?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  _count?: {
    messages: number;
  };
}

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

interface Agent {
  id: string;
  name: string;
  title?: string | null;
  avatarColor: string;
}

export default function ChatPage() {
  const router = useRouter();
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState<string>("");
  const [creating, setCreating] = useState(false);
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedThread) {
      fetchThread(selectedThread);
    }
  }, [selectedThread]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchData = async () => {
    try {
      const [threadsRes, agentsRes] = await Promise.all([
        fetch("/api/chat/threads"),
        fetch("/api/agents"),
      ]);

      const threadsData = await threadsRes.json();
      const agentsData = await agentsRes.json();

      setThreads(threadsData);
      setAgents(agentsData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchThread = async (id: string) => {
    try {
      const res = await fetch(`/api/chat/threads/${id}`);
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error("Failed to fetch thread:", error);
    }
  };

  const handleCreateThread = async () => {
    if (!selectedAgentId) {
      alert("Please select an agent");
      return;
    }

    setCreating(true);
    try {
      const res = await fetch("/api/chat/threads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: selectedAgentId,
        }),
      });

      if (res.ok) {
        const thread = await res.json();
        setThreads([thread, ...threads]);
        setShowNewModal(false);
        setSelectedAgentId("");
        setSelectedThread(thread.id);
      }
    } catch (error) {
      console.error("Failed to create thread:", error);
    } finally {
      setCreating(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || sending || !selectedThread) return;

    const userMessage = message;
    setMessage("");
    setSending(true);

    try {
      const res = await fetch(`/api/chat/threads/${selectedThread}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: userMessage }),
      });

      if (res.ok) {
        const { userMessage: newUserMsg, agentMessage } = await res.json();
        setMessages([
          ...messages,
          newUserMsg,
          ...(agentMessage ? [agentMessage] : []),
        ]);
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
        <p className="text-foreground/60">Loading conversations...</p>
      </div>
    );
  }

  // Chat view - if thread selected
  if (selectedThread) {
    const thread = threads.find((t) => t.id === selectedThread);

    return (
      <div className="flex flex-col h-full px-4 sm:px-0">
        <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6 flex-shrink-0">
          <button
            onClick={() => setSelectedThread(null)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
            aria-label="Back to threads"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          {thread?.agent ? (
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-base flex-shrink-0"
                style={{ backgroundColor: thread.agent.avatarColor }}
              >
                {thread.agent.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <h2 className="font-bold text-sm sm:text-base truncate">{thread.agent.name}</h2>
                {thread.agent.title && (
                  <p className="text-xs sm:text-sm text-accent-teal truncate">{thread.agent.title}</p>
                )}
              </div>
            </div>
          ) : (
            <h2 className="font-bold text-sm sm:text-base">Chat</h2>
          )}
        </div>

        <GlassCard className="flex-1 flex flex-col mb-3 sm:mb-4 min-h-0" immediate>
          <div className="flex-1 p-3 sm:p-4 md:p-6 overflow-y-auto">
            <div className="space-y-3 sm:space-y-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-8 sm:py-12">
                  <Bot className="w-12 h-12 sm:w-16 sm:h-16 text-foreground/40 mb-3 sm:mb-4" />
                  <p className="text-sm sm:text-base text-foreground/60">
                    Start a conversation with {thread?.agent?.name || "your agent"}
                  </p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-2 sm:gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
                  >
                    {msg.role === "agent" && msg.agent && (
                      <div
                        className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0"
                        style={{ backgroundColor: msg.agent.avatarColor }}
                      >
                        {msg.agent.name.charAt(0)}
                      </div>
                    )}
                    <div
                      className={`px-3 sm:px-4 py-2 sm:py-3 rounded-2xl max-w-[85%] sm:max-w-[75%] break-words ${
                        msg.role === "user"
                          ? "bg-gradient-to-r from-accent-teal to-accent-blue text-white"
                          : "glass-morphism"
                      }`}
                    >
                      <p className="whitespace-pre-wrap text-sm sm:text-base">{msg.content}</p>
                      <p className="text-xs opacity-60 mt-1">
                        {new Date(msg.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
              {sending && (
                <div className="flex gap-2 sm:gap-3">
                  {thread?.agent && (
                    <div
                      className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0"
                      style={{ backgroundColor: thread.agent.avatarColor }}
                    >
                      {thread.agent.name.charAt(0)}
                    </div>
                  )}
                  <div className="px-3 sm:px-4 py-2 sm:py-3 rounded-2xl glass-morphism">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-accent-teal rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-accent-teal rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                      <div className="w-2 h-2 bg-accent-teal rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </GlassCard>

        <form onSubmit={handleSend} className="flex gap-2 sm:gap-3 flex-shrink-0">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={sending}
            className="flex-1 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-accent-teal focus:outline-none disabled:opacity-50 text-sm sm:text-base"
          />
          <button
            type="submit"
            disabled={!message.trim() || sending}
            className="px-4 sm:px-6 h-12 sm:h-14 rounded-2xl bg-gradient-to-r from-accent to-accent-hover text-[#070B14] hover:shadow-lg hover:shadow-accent/25 hover:-translate-y-0.5 hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-2 flex-shrink-0"
            aria-label="Send message"
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </form>
      </div>
    );
  }

  // Thread list view
  return (
    <div className="px-4 sm:px-0">
      <Reveal immediate>
        <div className="flex items-center justify-between mb-6 sm:mb-8 gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">Chat</h1>
            <p className="text-sm sm:text-base text-foreground/70">Conversations with AI teammates</p>
          </div>
          <button
            onClick={() => setShowNewModal(true)}
            className="px-4 sm:px-6 h-10 sm:h-11 rounded-xl bg-gradient-to-r from-accent to-accent-hover text-[#070B14] hover:shadow-lg hover:shadow-accent/25 hover:-translate-y-0.5 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center gap-2 text-sm sm:text-base whitespace-nowrap flex-shrink-0"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">New Chat</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>
      </Reveal>

      {threads.length === 0 ? (
        <Reveal immediate delay={0.1}>
          <GlassCard className="p-8 sm:p-12 text-center" immediate>
            <MessageSquare className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-foreground/40" />
            <h3 className="text-lg sm:text-xl font-bold mb-2">No conversations yet</h3>
            <p className="text-sm sm:text-base text-foreground/60 mb-4 sm:mb-6">
              Start chatting with your AI teammates
            </p>
            <button
              onClick={() => setShowNewModal(true)}
              className="px-4 sm:px-6 py-2 sm:py-3 rounded-xl bg-gradient-to-r from-accent to-accent-hover text-[#070B14] hover:shadow-lg hover:shadow-accent/25 hover:-translate-y-0.5 hover:scale-[1.01] active:scale-[0.98] transition-all inline-flex items-center gap-2 text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              Start Chat
            </button>
          </GlassCard>
        </Reveal>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {threads.map((thread, i) => (
            <Reveal immediate key={thread.id} delay={0.1} index={i} stagger={80}>
              <div
                onClick={() => setSelectedThread(thread.id)}
                className="cursor-pointer hover:scale-[1.02] transition-transform"
              >
                <GlassCard className="p-4 sm:p-6" immediate>
                  <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                    {thread.agent ? (
                      <div
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-sm sm:text-base"
                        style={{ backgroundColor: thread.agent.avatarColor }}
                      >
                        {thread.agent.name.charAt(0)}
                      </div>
                    ) : (
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-accent-teal to-accent-blue flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold truncate text-sm sm:text-base">
                        {thread.title || `Chat with ${thread.agent?.name || "Agent"}`}
                      </h3>
                      {thread.agent?.title && (
                        <p className="text-xs text-accent-teal truncate">{thread.agent.title}</p>
                      )}
                      {thread.project && (
                        <p className="text-xs text-foreground/60 mt-1 truncate">
                          {thread.project.name}
                        </p>
                      )}
                      <p className="text-xs text-foreground/60 mt-1">
                        {thread._count?.messages || 0} messages
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-foreground/50">
                    Updated {new Date(thread.updatedAt).toLocaleDateString()}
                  </p>
                </GlassCard>
              </div>
            </Reveal>
          ))}
        </div>
      )}

      {/* New Chat Modal */}
      {showNewModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowNewModal(false)}
        >
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg">
            <GlassCard className="p-6 sm:p-8" immediate>
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Start New Chat</h2>
              {agents.length === 0 ? (
                <div className="text-center py-4 sm:py-6">
                  <Bot className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 text-foreground/40" />
                  <p className="text-sm sm:text-base text-foreground/60 mb-3 sm:mb-4">
                    No agents available yet
                  </p>
                  <button
                    onClick={() => router.push("/app/agents/new")}
                    className="px-4 sm:px-6 py-2 sm:py-3 rounded-xl bg-gradient-to-r from-accent to-accent-hover text-[#070B14] hover:shadow-lg transition-all text-sm sm:text-base"
                  >
                    Create Agent First
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 max-h-[50vh] overflow-y-auto">
                    {agents.map((agent) => (
                      <button
                        key={agent.id}
                        onClick={() => setSelectedAgentId(agent.id)}
                        className={`w-full p-3 sm:p-4 rounded-xl transition-all text-left ${
                          selectedAgentId === agent.id
                            ? "bg-accent-teal/20 border-2 border-accent-teal"
                            : "bg-white/5 border border-white/10 hover:bg-white/10"
                        }`}
                      >
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-base flex-shrink-0"
                            style={{ backgroundColor: agent.avatarColor }}
                          >
                            {agent.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-sm sm:text-base truncate">{agent.name}</p>
                            {agent.title && (
                              <p className="text-xs text-foreground/60 truncate">{agent.title}</p>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2 sm:gap-3">
                    <button
                      onClick={() => setShowNewModal(false)}
                      className="flex-1 px-4 sm:px-6 py-2 sm:py-3 rounded-xl water-glass text-foreground hover:border-white/30 transition-all text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateThread}
                      disabled={!selectedAgentId || creating}
                      className="flex-1 px-4 sm:px-6 py-2 sm:py-3 rounded-xl bg-gradient-to-r from-accent to-accent-hover text-[#070B14] hover:shadow-lg transition-all disabled:opacity-50 text-sm sm:text-base"
                    >
                      {creating ? "Starting..." : "Start Chat"}
                    </button>
                  </div>
                </>
              )}
            </GlassCard>
          </div>
        </div>
      )}
    </div>
  );
}
