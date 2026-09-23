"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import GlassCard from "@/components/GlassCard";
import Reveal from "@/components/motion/Reveal";
import { MessageSquare, Plus, Bot } from "lucide-react";

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
  _count?: {
    messages: number;
  };
}

interface Agent {
  id: string;
  name: string;
  title?: string | null;
  avatarColor: string;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ProjectChatPage({ params }: PageProps) {
  const router = useRouter();
  const [slug, setSlug] = useState<string>("");
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState<string>("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    params.then(({ slug: resolvedSlug }) => {
      setSlug(resolvedSlug);
      fetchData(resolvedSlug);
    });
  }, [params]);

  const fetchData = async (projectSlug: string) => {
    try {
      const [projectsRes, agentsRes] = await Promise.all([
        fetch("/api/projects"),
        fetch("/api/agents"),
      ]);

      const projects = await projectsRes.json();
      const project = projects.find((p: any) => p.slug === projectSlug);

      if (project) {
        const threadsRes = await fetch(`/api/chat/threads?projectId=${project.id}`);
        const threadsData = await threadsRes.json();
        setThreads(threadsData);

        const agentsData = await agentsRes.json();
        const projectAgents = agentsData.filter((a: any) => a.projectId === project.id);
        setAgents(projectAgents);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateThread = async () => {
    if (!selectedAgentId) {
      alert("Please select an agent");
      return;
    }

    setCreating(true);
    try {
      const projectsRes = await fetch("/api/projects");
      const projects = await projectsRes.json();
      const project = projects.find((p: any) => p.slug === slug);

      const res = await fetch("/api/chat/threads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: project.id,
          agentId: selectedAgentId,
        }),
      });

      if (res.ok) {
        const thread = await res.json();
        router.push(`/app/p/${slug}/chat/${thread.id}`);
      }
    } catch (error) {
      console.error("Failed to create thread:", error);
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-foreground/60">Loading conversations...</p>
      </div>
    );
  }

  return (
    <div>
      <Reveal immediate>
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
        <Reveal immediate delay={0.1}>
          <GlassCard className="p-12 text-center" immediate>
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
            <Reveal immediate key={thread.id} delay={0.1} index={i} stagger={80}>
              <div
                onClick={() => router.push(`/app/p/${slug}/chat/${thread.id}`)}
                className="cursor-pointer hover:scale-[1.02] transition-transform"
              >
                <GlassCard className="p-6" immediate>
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
            <GlassCard className="p-8 max-w-lg w-full" immediate>
              <h2 className="text-2xl font-bold mb-6">Start New Chat</h2>
              {agents.length === 0 ? (
                <div className="text-center py-6">
                  <Bot className="w-12 h-12 mx-auto mb-3 text-foreground/40" />
                  <p className="text-foreground/60 mb-4">
                    No agents in this project yet
                  </p>
                  <button
                    onClick={() => router.push(`/app/p/${slug}/agents/new`)}
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
