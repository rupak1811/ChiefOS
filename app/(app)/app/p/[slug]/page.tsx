import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import GlassCard from "@/components/GlassCard";
import Reveal from "@/components/motion/Reveal";
import Link from "next/link";
import { Bot, Users, MessageSquare, ListTodo, Plus, FolderKanban } from "lucide-react";

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
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
        take: 6,
      },
      teams: {
        include: {
          _count: {
            select: { members: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 4,
      },
      workItems: {
        orderBy: { updatedAt: "desc" },
        take: 10,
        include: {
          agent: {
            select: {
              name: true,
              avatarColor: true,
            },
          },
        },
      },
      _count: {
        select: {
          agents: true,
          teams: true,
          chatThreads: true,
          workItems: true,
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
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: project.color + "20" }}
            >
              <FolderKanban className="w-7 h-7" style={{ color: project.color }} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{project.name}</h1>
              {project.description && (
                <p className="text-foreground/70">{project.description}</p>
              )}
            </div>
          </div>
        </div>
      </Reveal>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Reveal immediate delay={0.1} index={0} stagger={60}>
          <Link href={`/app/p/${slug}/agents`}>
            <GlassCard className="p-4 hover:scale-[1.02] transition-transform cursor-pointer" immediate>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-teal to-accent-blue flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{project._count.agents}</p>
                  <p className="text-sm text-foreground/60">Agents</p>
                </div>
              </div>
            </GlassCard>
          </Link>
        </Reveal>

        <Reveal immediate delay={0.1} index={1} stagger={60}>
          <Link href={`/app/p/${slug}/teams`}>
            <GlassCard className="p-4 hover:scale-[1.02] transition-transform cursor-pointer" immediate>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{project._count.teams}</p>
                  <p className="text-sm text-foreground/60">Teams</p>
                </div>
              </div>
            </GlassCard>
          </Link>
        </Reveal>

        <Reveal immediate delay={0.1} index={2} stagger={60}>
          <Link href={`/app/p/${slug}/chat`}>
            <GlassCard className="p-4 hover:scale-[1.02] transition-transform cursor-pointer" immediate>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{project._count.chatThreads}</p>
                  <p className="text-sm text-foreground/60">Chats</p>
                </div>
              </div>
            </GlassCard>
          </Link>
        </Reveal>

        <Reveal immediate delay={0.1} index={3} stagger={60}>
          <Link href={`/app/p/${slug}/tasks`}>
            <GlassCard className="p-4 hover:scale-[1.02] transition-transform cursor-pointer" immediate>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center">
                  <ListTodo className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{project._count.workItems}</p>
                  <p className="text-sm text-foreground/60">Tasks</p>
                </div>
              </div>
            </GlassCard>
          </Link>
        </Reveal>
      </div>

      {/* Quick Actions */}
      <Reveal immediate delay={0.2}>
        <div className="flex flex-wrap gap-3 mb-8">
          <Link href={`/app/p/${slug}/agents/new`}>
            <button className="px-6 h-11 rounded-xl bg-gradient-to-r from-accent to-accent-hover text-[#070B14] hover:shadow-lg hover:shadow-accent/25 hover:-translate-y-0.5 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center gap-2">
              <Plus className="w-5 h-5" />
              New Agent
            </button>
          </Link>
          <Link href={`/app/p/${slug}/chat`}>
            <button className="px-6 h-11 rounded-xl water-glass text-foreground hover:border-white/30 hover:-translate-y-0.5 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Start Chat
            </button>
          </Link>
          <Link href={`/app/p/${slug}/tasks`}>
            <button className="px-6 h-11 rounded-xl water-glass text-foreground hover:border-white/30 hover:-translate-y-0.5 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center gap-2">
              <ListTodo className="w-5 h-5" />
              New Task
            </button>
          </Link>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agents */}
        <Reveal immediate delay={0.3}>
          <GlassCard className="p-6" immediate>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Agents</h3>
              <Link
                href={`/app/p/${slug}/agents`}
                className="text-sm text-accent-teal hover:underline"
              >
                View all
              </Link>
            </div>
            {project.agents.length === 0 ? (
              <div className="text-center py-8 text-foreground/60">
                <Bot className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p>No agents in this project yet</p>
                <Link href={`/app/p/${slug}/agents/new`}>
                  <button className="mt-4 px-4 py-2 rounded-lg bg-gradient-to-r from-accent to-accent-hover text-[#070B14] hover:shadow-lg transition-all">
                    Create First Agent
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {project.agents.map((agent) => (
                  <Link key={agent.id} href={`/app/agents?id=${agent.id}`}>
                    <div className="p-3 glass-morphism rounded-xl hover:bg-white/10 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: agent.avatarColor }}
                        >
                          {agent.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{agent.name}</p>
                          {agent.title && (
                            <p className="text-xs text-foreground/60 truncate">{agent.title}</p>
                          )}
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            agent.status === "active"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-gray-500/20 text-gray-400"
                          }`}
                        >
                          {agent.status}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </GlassCard>
        </Reveal>

        {/* Recent Tasks */}
        <Reveal immediate delay={0.3}>
          <GlassCard className="p-6" immediate>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Recent Tasks</h3>
              <Link
                href={`/app/p/${slug}/tasks`}
                className="text-sm text-accent-teal hover:underline"
              >
                View all
              </Link>
            </div>
            {project.workItems.length === 0 ? (
              <div className="text-center py-8 text-foreground/60">
                <ListTodo className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p>No tasks yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {project.workItems.map((task) => (
                  <div key={task.id} className="p-3 glass-morphism rounded-xl">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{task.title}</p>
                        {task.agent && (
                          <p className="text-xs text-foreground/60">
                            Assigned to {task.agent.name}
                          </p>
                        )}
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded whitespace-nowrap ${
                          task.status === "done"
                            ? "bg-green-500/20 text-green-400"
                            : task.status === "in_progress"
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {task.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </Reveal>
      </div>
    </div>
  );
}
