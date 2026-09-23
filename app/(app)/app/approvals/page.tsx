import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import GlassCard from "@/components/GlassCard";
import Reveal from "@/components/motion/Reveal";
import ApprovalActions from "@/components/ApprovalActions";
import { Clock, CheckCircle, XCircle } from "lucide-react";

export default async function ApprovalsPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const approvals = await prisma.approval.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      token: {
        include: {
          agent: true,
        },
      },
    },
  });

  const pending = approvals.filter((a) => a.status === "pending");
  const resolved = approvals.filter((a) => a.status !== "pending");

  return (
    <div>
      <Reveal immediate>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Approvals</h1>
          <p className="text-foreground/70">
            Lead co-ordinates your agent team. Sensitive actions wait for your approval.
          </p>
        </div>
      </Reveal>

      <div className="space-y-6">
        <div>
          <Reveal immediate delay={0.1}>
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-yellow-400" />
              Waiting on you ({pending.length})
            </h2>
          </Reveal>
          <div className="space-y-4">
            {pending.map((approval, index) => (
              <Reveal immediate key={approval.id} delay={0.15} index={index} stagger={60}>
                <GlassCard className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold">{approval.token.agent.name} wants to {approval.action}</h3>
                      <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg text-xs">
                        Waiting on you
                      </span>
                    </div>
                    <p className="text-sm text-foreground/60">
                      {approval.metadata || "Review draft?"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div>
                    <span className="px-2 py-1 bg-accent-teal/10 text-accent-teal rounded text-xs font-mono">
                      {approval.scope}
                    </span>
                    <span className="ml-3 text-xs text-foreground/50">
                      {new Date(approval.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <ApprovalActions approvalId={approval.id} />
                </div>
                </GlassCard>
              </Reveal>
            ))}
            {pending.length === 0 && (
              <Reveal immediate delay={0.15}>
                <GlassCard className="p-8 text-center">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-400/50" />
                <p className="text-foreground/60">Done—no approvals waiting</p>
                </GlassCard>
              </Reveal>
            )}
          </div>
        </div>

        <div>
          <Reveal immediate delay={0.2}>
            <h2 className="text-xl font-bold mb-4">Recent History</h2>
          </Reveal>
          <div className="space-y-3">
            {resolved.slice(0, 10).map((approval, index) => (
              <Reveal immediate key={approval.id} delay={0.25} index={index} stagger={50}>
                <GlassCard className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{approval.action}</p>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          approval.status === "approved"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {approval.status}
                      </span>
                    </div>
                    <p className="text-sm text-foreground/60">
                      {approval.token.agent.name} • {approval.scope}
                    </p>
                  </div>
                  {approval.status === "approved" ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400" />
                  )}
                </div>
                </GlassCard>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
