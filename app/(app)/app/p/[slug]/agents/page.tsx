import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import GlassCard from "@/components/GlassCard";
import Reveal from "@/components/motion/Reveal";
import Link from "next/link";
import { Bot, Plus, Trash2 } from "lucide-react";

export default async function ProjectAgentsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  const project = await prisma.project.findFirst({
    where: {
      slug,
      userId: session.user.id,
    },
    include: {
      agents: {
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
        include: {
          _count: {
            select: {
              chatThreads: true,
              workItems: true,
            },
          },
        },
      },
    },
  });

  if (!project) {
    notFound();
  }

  return (
    <div>
      <Reveal immediate>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">AI Teammates</h1>
            <p className="text-foreground/70">
              Manage agents in {project.name}
            </p>
          </div>
          <Link href={`/app/p/${slug}/agents/new`}>
            <button className="px-6 h-11 rounded-xl bg-gradient-to-r from-accent to-accent-hover text-[#070B14] hover:shadow-lg hover:shadow-accent/25 hover:-translate-y-0.5 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center gap-2">
              <Plus className="w-5 h-5" />
              New Agent
            </button>
          </Link>
        </div>
      </Reveal>

      {project.agents.length === 0 ? (
        <Reveal immediate delay={0.1}>
          <GlassCard className="p-12 text-center">
            <Bot className="w-16 h-16 mx-auto mb-4 text-foreground/40" />
            <h3 className="text-xl font-bold mb-2">No agents yet</h3>
            <p className="text-foreground/60 mb-6">
              Create your first AI teammate for this project
            </p>
            <Link href={`/app/p/${slug}/agents/new`}>
              <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-accent to-accent-hover text-[#070B14] hover:shadow-lg hover:shadow-accent/25 hover:-translate-y-0.5 hover:scale-[1.01] active:scale-[0.98] transition-all inline-flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Create Agent
              </button>
            </Link>
          </GlassCard>
        </Reveal>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {project.agents.map((agent, i) => {
            const capabilities = agent.capabilities ? JSON.parse(agent.capabilities) : [];
            
            return (
              <Reveal immediate key={agent.id} delay={0.1} index={i} stagger={80}>
                <GlassCard className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-xl"
                      style={{ backgroundColor: agent.avatarColor }}
                    >
                      {agent.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-bold">{agent.name}</h3>
                          {agent.title && (
                            <p className="text-sm text-accent-teal">{agent.title}</p>
                          )}
                        </div>
                      </div>
                      <p className="text-foreground/70 text-sm line-clamp-2">
                        {agent.description}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-accent-teal mb-2">
                      Capabilities
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {capabilities.slice(0, 3).map((cap: string, i: number) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs font-mono"
                        >
                          {cap}
                        </span>
                      ))}
                      {capabilities.length > 3 && (
                        <span className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs">
                          +{capabilities.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                    <div>
                      <p className="text-sm text-foreground/60">Chats</p>
                      <p className="text-2xl font-bold text-accent-teal">
                        {agent._count.chatThreads}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60">Tasks</p>
                      <p className="text-2xl font-bold text-accent-blue">
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
