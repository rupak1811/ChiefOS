import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import GlassCard from "@/components/GlassCard";
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Approvals</h1>
        <p className="text-foreground/70">
          Review and approve sensitive agent operations
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-yellow-400" />
            Pending ({pending.length})
          </h2>
          <div className="space-y-4">
            {pending.map((approval) => (
              <GlassCard key={approval.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold">{approval.action}</h3>
                      <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg text-xs">
                        Pending
                      </span>
                    </div>
                    <p className="text-sm text-foreground/70 mb-2">
                      Agent: {approval.token.agent.name}
                    </p>
                    <p className="text-sm text-foreground/60">
                      {approval.metadata || "No additional details provided"}
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
            ))}
            {pending.length === 0 && (
              <GlassCard className="p-8 text-center">
                <p className="text-foreground/60">No pending approvals</p>
              </GlassCard>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Recent History</h2>
          <div className="space-y-3">
            {resolved.slice(0, 10).map((approval) => (
              <GlassCard key={approval.id} className="p-4">
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
