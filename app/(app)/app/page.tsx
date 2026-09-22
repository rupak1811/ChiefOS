import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import GlassCard from "@/components/GlassCard";
import Reveal from "@/components/motion/Reveal";
import { Bot, CheckSquare, FileText, AlertTriangle } from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

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
    <div>
      <Reveal>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-foreground/70">
            Welcome back, {session?.user?.name || "User"}
          </p>
        </div>
      </Reveal>

      {user?.killSwitch && (
        <Reveal delay={0.1}>
          <div className="mb-6 p-4 glass-morphism border-2 border-red-500/50 rounded-xl flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-red-400" />
          <div className="flex-1">
            <p className="font-bold text-red-400">Paused</p>
            <p className="text-sm text-foreground/70">
              Kill switch is on. Approvals will not run until you resume.
            </p>
          </div>
          <a
            href="/app/kill-switch"
            className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
          >
            Manage
          </a>
          </div>
        </Reveal>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Reveal delay={0.15} index={0} stagger={80}>
          <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Active Agents</h3>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-teal to-accent-blue flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-4xl font-bold text-accent-teal">{agents.length}</p>
          <p className="text-sm text-foreground/60 mt-2">
            Agents ready to assist
          </p>
          </GlassCard>
        </Reveal>

        <Reveal delay={0.15} index={1} stagger={80}>
          <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Pending Approvals</h3>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
              <CheckSquare className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-4xl font-bold text-yellow-400">{pendingApprovals}</p>
          <p className="text-sm text-foreground/60 mt-2">
            Awaiting your review
          </p>
          </GlassCard>
        </Reveal>

        <Reveal delay={0.15} index={2} stagger={80}>
          <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Actions Logged</h3>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-4xl font-bold text-purple-400">
            {await prisma.actionLedger.count({ where: { userId } })}
          </p>
          <p className="text-sm text-foreground/60 mt-2">
            Total operations tracked
          </p>
          </GlassCard>
        </Reveal>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Reveal delay={0.3}>
          <GlassCard className="p-6">
          <h3 className="text-xl font-bold mb-4">Active Agents</h3>
          <div className="space-y-3">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="p-4 glass-morphism rounded-xl flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">{agent.name}</p>
                  <p className="text-sm text-foreground/60">{agent.description}</p>
                </div>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs">
                  Active
                </span>
              </div>
            ))}
            {agents.length === 0 && (
              <p className="text-foreground/60 text-center py-4">
                No agents configured yet
              </p>
            )}
          </div>
          </GlassCard>
        </Reveal>

        <Reveal delay={0.3}>
          <GlassCard className="p-6">
          <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentLedger.map((entry) => (
              <div key={entry.id} className="p-4 glass-morphism rounded-xl">
                <div className="flex items-start justify-between mb-2">
                  <p className="font-medium">{entry.agent.name}</p>
                  <span className="text-xs text-foreground/50">
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm text-foreground/70">{entry.action}</p>
                <span className="inline-block mt-2 px-2 py-1 bg-accent-teal/10 text-accent-teal rounded text-xs font-mono">
                  {entry.scope}
                </span>
              </div>
            ))}
            {recentLedger.length === 0 && (
              <p className="text-foreground/60 text-center py-4">
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
