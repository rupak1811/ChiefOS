import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import GlassCard from "@/components/GlassCard";
import Reveal from "@/components/motion/Reveal";
import { Bot, CheckSquare, FileText, AlertTriangle } from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/api/auth/signin");
  }

  const [agents, pendingApprovals, recentLedger, user] = await Promise.all([
    prisma.agent.findMany({ where: { isActive: true } }),
    prisma.approval.count({ where: { userId, status: "pending" } }),
    prisma.actionLedger.findMany({
      where: { userId },
      orderBy: { timestamp: "desc" },
      take: 5,
      include: { agent: true },
    }),
    prisma.user.findUnique({ where: { id: userId }, select: { killSwitch: true } }),
  ]);

  return (
    <div className="w-full">
      <Reveal immediate>
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-sm sm:text-base text-foreground/70">
            Welcome back, {session?.user?.name || "User"}
          </p>
        </div>
      </Reveal>

      {user?.killSwitch && (
        <Reveal delay={0.1} immediate>
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 glass-morphism border-2 border-red-500/50 rounded-xl flex items-start sm:items-center gap-2 sm:gap-3 flex-col sm:flex-row">
          <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-bold text-red-400 text-sm sm:text-base">Paused</p>
            <p className="text-xs sm:text-sm text-foreground/70">
              Kill switch is on. Approvals will not run until you resume.
            </p>
          </div>
          <a
            href="/app/kill-switch"
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-xs sm:text-sm whitespace-nowrap"
          >
            Manage
          </a>
          </div>
        </Reveal>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Reveal delay={0.15} index={0} stagger={80} immediate>
          <GlassCard className="p-4 sm:p-6" immediate>
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg font-semibold">Active Agents</h3>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-accent-teal to-accent-blue flex items-center justify-center">
              <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
          </div>
          <p className="text-3xl sm:text-4xl font-bold text-accent-teal">{agents.length}</p>
          <p className="text-xs sm:text-sm text-foreground/60 mt-1 sm:mt-2">
            Agents ready to assist
          </p>
          </GlassCard>
        </Reveal>

        <Reveal delay={0.15} index={1} stagger={80} immediate>
          <GlassCard className="p-4 sm:p-6" immediate>
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg font-semibold">Pending Approvals</h3>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
              <CheckSquare className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
          </div>
          <p className="text-3xl sm:text-4xl font-bold text-yellow-400">{pendingApprovals}</p>
          <p className="text-xs sm:text-sm text-foreground/60 mt-1 sm:mt-2">
            Awaiting your review
          </p>
          </GlassCard>
        </Reveal>

        <Reveal delay={0.15} index={2} stagger={80} immediate>
          <GlassCard className="p-4 sm:p-6" immediate>
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg font-semibold">Actions Logged</h3>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
          </div>
          <p className="text-3xl sm:text-4xl font-bold text-purple-400">
            {await prisma.actionLedger.count({ where: { userId } })}
          </p>
          <p className="text-xs sm:text-sm text-foreground/60 mt-1 sm:mt-2">
            Total operations tracked
          </p>
          </GlassCard>
        </Reveal>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Reveal delay={0.3} immediate>
          <GlassCard className="p-4 sm:p-6" immediate>
          <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Active Agents</h3>
          <div className="space-y-2 sm:space-y-3">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="p-3 sm:p-4 glass-morphism rounded-xl flex items-center justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm sm:text-base truncate">{agent.name}</p>
                  <p className="text-xs sm:text-sm text-foreground/60 line-clamp-1">{agent.description}</p>
                </div>
                <span className="px-2 sm:px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs whitespace-nowrap flex-shrink-0">
                  Active
                </span>
              </div>
            ))}
            {agents.length === 0 && (
              <p className="text-foreground/60 text-center py-4 text-sm">
                No agents configured yet
              </p>
            )}
          </div>
          </GlassCard>
        </Reveal>

        <Reveal delay={0.3} immediate>
          <GlassCard className="p-4 sm:p-6" immediate>
          <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Recent Activity</h3>
          <div className="space-y-2 sm:space-y-3">
            {recentLedger.map((entry) => (
              <div key={entry.id} className="p-3 sm:p-4 glass-morphism rounded-xl">
                <div className="flex items-start justify-between mb-2 gap-2">
                  <p className="font-medium text-sm sm:text-base line-clamp-1">{entry.agent?.name ?? 'Unknown'}</p>
                  <span className="text-xs text-foreground/50 whitespace-nowrap flex-shrink-0">
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-foreground/70 line-clamp-2">{entry.action}</p>
                <span className="inline-block mt-2 px-2 py-1 bg-accent-teal/10 text-accent-teal rounded text-xs font-mono">
                  {entry.scope}
                </span>
              </div>
            ))}
            {recentLedger.length === 0 && (
              <p className="text-foreground/60 text-center py-4 text-sm">
                No activity yet
              </p>
            )}
          </div>
          </GlassCard>
        </Reveal>
      </div>
    </div>
  );
}
