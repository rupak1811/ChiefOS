import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import GlassCard from "@/components/GlassCard";
import Reveal from "@/components/motion/Reveal";
import { Users, Plus, Bot } from "lucide-react";

export default async function ProjectTeamsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return null;
  }

  const project = await prisma.project.findFirst({
    where: {
      slug,
      userId: session.user.id,
    },
    include: {
      teams: {
        include: {
          members: {
            include: {
              agent: {
                select: {
                  id: true,
                  name: true,
                  title: true,
                  avatarColor: true,
                  avatarShape: true,
                },
              },
            },
          },
          _count: {
            select: {
              chatThreads: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!project) {
    notFound();
  }

  return (
    <div>
      <Reveal>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Teams</h1>
            <p className="text-foreground/70">
              Organize agents into collaborative teams in {project.name}
            </p>
          </div>
          <button 
            onClick={() => alert("Create team UI - coming in next iteration")}
            className="px-6 h-11 rounded-xl bg-gradient-to-r from-accent to-accent-hover text-[#070B14] hover:shadow-lg hover:shadow-accent/25 hover:-translate-y-0.5 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Team
          </button>
        </div>
      </Reveal>

      {project.teams.length === 0 ? (
        <Reveal delay={0.1}>
          <GlassCard className="p-12 text-center">
            <Users className="w-16 h-16 mx-auto mb-4 text-foreground/40" />
            <h3 className="text-xl font-bold mb-2">No teams yet</h3>
            <p className="text-foreground/60 mb-6">
              Create teams to organize your agents for collaborative work
            </p>
            <button 
              onClick={() => alert("Create team UI - coming in next iteration")}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-accent to-accent-hover text-[#070B14] hover:shadow-lg hover:shadow-accent/25 hover:-translate-y-0.5 hover:scale-[1.01] active:scale-[0.98] transition-all inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Team
            </button>
          </GlassCard>
        </Reveal>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {project.teams.map((team, i) => (
            <Reveal key={team.id} delay={0.1} index={i} stagger={80}>
              <GlassCard className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{team.name}</h3>
                {team.description && (
                  <p className="text-foreground/60 text-sm mb-4 line-clamp-2">
                    {team.description}
                  </p>
                )}
                <div className="space-y-2 mb-4">
                  <p className="text-sm font-medium text-foreground/70">
                    {team.members.length} member{team.members.length !== 1 ? "s" : ""}
                  </p>
                  <div className="flex -space-x-2">
                    {team.members.slice(0, 5).map((member) => (
                      <div
                        key={member.agent.id}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-background"
                        style={{ backgroundColor: member.agent.avatarColor }}
                        title={member.agent.name}
                      >
                        {member.agent.name.charAt(0)}
                      </div>
                    ))}
                    {team.members.length > 5 && (
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 text-xs font-bold border-2 border-background">
                        +{team.members.length - 5}
                      </div>
                    )}
                  </div>
                </div>
                <div className="pt-4 border-t border-white/10">
                  <p className="text-sm text-foreground/60">Conversations</p>
                  <p className="text-2xl font-bold text-accent-teal">
                    {team._count.chatThreads}
                  </p>
                </div>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
