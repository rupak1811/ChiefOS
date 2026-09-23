import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import GlassCard from "@/components/GlassCard";
import Button from "@/components/Button";
import Reveal from "@/components/motion/Reveal";
import Link from "next/link";
import { Brain, Database, Code2, Shield, Bot, Plus, FolderKanban } from "lucide-react";

const agentIcons = {
  Lead: Brain,
  Memory: Database,
  Code: Code2,
  Guardian: Shield,
};

export default async function AgentsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  const agents = await prisma.agent.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      project: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      _count: {
        select: {
          chatThreads: true,
          workItems: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="w-full">
      <Reveal immediate>
        <div className="flex items-center justify-between mb-6 sm:mb-8 gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">Agents</h1>
            <p className="text-sm sm:text-base text-foreground/70">
              Your AI teammates with specialized roles and capabilities
            </p>
          </div>
          <Button href="/app/agents/new" variant="primary">
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-2" />
            <span className="hidden sm:inline">New Agent</span>
          </Button>
        </div>
      </Reveal>

      {agents.length === 0 ? (
        <Reveal immediate delay={0.1}>
          <GlassCard className="p-8 sm:p-12 text-center" immediate>
            <Bot className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-foreground/40" />
            <h3 className="text-lg sm:text-xl font-bold mb-2">No agents yet</h3>
            <p className="text-sm sm:text-base text-foreground/60 mb-4 sm:mb-6">
              Create your first AI teammates to help with projects and tasks
            </p>
            <Link href="/app/projects">
              <Button>
                <FolderKanban className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Go to Projects
              </Button>
            </Link>
          </GlassCard>
        </Reveal>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {agents.map((agent, index) => {
            const Icon = agentIcons[agent.name as keyof typeof agentIcons] || Bot;
            const capabilities = agent.capabilities ? JSON.parse(agent.capabilities) : [];
            
            return (
              <Reveal immediate key={agent.id} delay={0.1} index={index} stagger={80}>
                <GlassCard className="p-4 sm:p-6" immediate>
                  <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-lg sm:text-xl"
                      style={{ backgroundColor: agent.avatarColor }}
                    >
                      {agent.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1 sm:mb-2 gap-2">
                        <div className="min-w-0">
                          <h3 className="text-lg sm:text-xl font-bold truncate">{agent.name}</h3>
                          {agent.title && (
                            <p className="text-xs sm:text-sm text-accent-teal truncate">{agent.title}</p>
                          )}
                        </div>
                        <span
                          className={`px-2 sm:px-3 py-1 rounded-lg text-xs whitespace-nowrap flex-shrink-0 ${
                            agent.status === "active"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-gray-500/20 text-gray-400"
                          }`}
                        >
                          {agent.status}
                        </span>
                      </div>
                      <p className="text-foreground/70 text-xs sm:text-sm line-clamp-2">
                        {agent.description}
                      </p>
                    </div>
                  </div>

                  {agent.project && (
                    <Link href={`/app/p/${agent.project.slug}`}>
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-3 text-xs sm:text-sm text-foreground/70 hover:text-accent-teal transition-colors">
                        <FolderKanban className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="truncate">{agent.project.name}</span>
                      </div>
                    </Link>
                  )}

                  <div className="mb-3 sm:mb-4">
                    <h4 className="text-xs sm:text-sm font-semibold text-accent-teal mb-2">
                      Capabilities
                    </h4>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {capabilities.map((cap: string, i: number) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 sm:py-1 bg-white/5 border border-white/10 rounded text-xs font-mono"
                        >
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-white/10">
                    <div>
                      <p className="text-xs sm:text-sm text-foreground/60">Chats</p>
                      <p className="text-xl sm:text-2xl font-bold text-accent-teal">
                        {agent._count.chatThreads}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-foreground/60">Tasks</p>
                      <p className="text-xl sm:text-2xl font-bold text-accent-blue">
                        {agent._count.workItems}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </Reveal>
            );
          })}
        </div>
      )}
    </div>
  );
}
