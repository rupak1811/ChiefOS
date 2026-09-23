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
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-4 mb-6 flex-shrink-0">
          <button
            onClick={() => setSelectedThread(null)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          {thread?.agent ? (
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

        <GlassCard className="flex-1 flex flex-col mb-4 min-h-0">
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <Bot className="w-16 h-16 text-foreground/40 mb-4" />
                  <p className="text-foreground/60">
                    Start a conversation with {thread?.agent?.name || "your agent"}
                  </p>
                </div>
              ) : (
                messages.map((msg) => (
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
                  {thread?.agent && (
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

        <form onSubmit={handleSend} className="flex gap-3 flex-shrink-0">
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

  // Thread list view
  return (
    <div>
      <Reveal>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Chat</h1>
            <p className="text-foreground/70">Conversations with AI teammates</p>
          </div>
          <button
            onClick={() => setShowNewModal(true)}
            className="px-6 h-11 rounded-xl bg-gradient-to-r from-accent to-accent-hover text-[#070B14] hover:shadow-lg hover:shadow-accent/25 hover:-translate-y-0.5 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Chat
          </button>
        </div>
      </Reveal>

      {threads.length === 0 ? (
        <Reveal delay={0.1}>
          <GlassCard className="p-12 text-center">
            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-foreground/40" />
            <h3 className="text-xl font-bold mb-2">No conversations yet</h3>
            <p className="text-foreground/60 mb-6">
              Start chatting with your AI teammates
            </p>
            <button
              onClick={() => setShowNewModal(true)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-accent to-accent-hover text-[#070B14] hover:shadow-lg hover:shadow-accent/25 hover:-translate-y-0.5 hover:scale-[1.01] active:scale-[0.98] transition-all inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Start Chat
            </button>
          </GlassCard>
        </Reveal>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {threads.map((thread, i) => (
            <Reveal key={thread.id} delay={0.1} index={i} stagger={80}>
              <div
                onClick={() => setSelectedThread(thread.id)}
                className="cursor-pointer hover:scale-[1.02] transition-transform"
              >
                <GlassCard className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    {thread.agent ? (
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold"
                        style={{ backgroundColor: thread.agent.avatarColor }}
                      >
                        {thread.agent.name.charAt(0)}
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-teal to-accent-blue flex items-center justify-center">
                        <MessageSquare className="w-6 h-6 text-white" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold truncate">
                        {thread.title || `Chat with ${thread.agent?.name || "Agent"}`}
                      </h3>
                      {thread.agent?.title && (
                        <p className="text-xs text-accent-teal">{thread.agent.title}</p>
                      )}
                      {thread.project && (
                        <p className="text-xs text-foreground/60 mt-1">
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
          <div onClick={(e) => e.stopPropagation()}>
            <GlassCard className="p-8 max-w-lg w-full">
              <h2 className="text-2xl font-bold mb-6">Start New Chat</h2>
              {agents.length === 0 ? (
                <div className="text-center py-6">
                  <Bot className="w-12 h-12 mx-auto mb-3 text-foreground/40" />
                  <p className="text-foreground/60 mb-4">
                    No agents available yet
                  </p>
                  <button
                    onClick={() => router.push("/app/agents/new")}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-accent to-accent-hover text-[#070B14] hover:shadow-lg transition-all"
                  >
                    Create Agent First
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-3 mb-6">
                    {agents.map((agent) => (
                      <button
                        key={agent.id}
                        onClick={() => setSelectedAgentId(agent.id)}
                        className={`w-full p-4 rounded-xl transition-all text-left ${
                          selectedAgentId === agent.id
                            ? "bg-accent-teal/20 border-2 border-accent-teal"
                            : "bg-white/5 border border-white/10 hover:bg-white/10"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                            style={{ backgroundColor: agent.avatarColor }}
                          >
                            {agent.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{agent.name}</p>
                            {agent.title && (
                              <p className="text-xs text-foreground/60">{agent.title}</p>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowNewModal(false)}
                      className="flex-1 px-6 py-3 rounded-xl water-glass text-foreground hover:border-white/30 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateThread}
                      disabled={!selectedAgentId || creating}
                      className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-accent to-accent-hover text-[#070B14] hover:shadow-lg transition-all disabled:opacity-50"
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
