import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import GlassCard from "@/components/GlassCard";
import Reveal from "@/components/motion/Reveal";
import { FileText, Filter } from "lucide-react";

export default async function LedgerPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/api/auth/signin");
  }

  const entries = await prisma.actionLedger.findMany({
    where: { userId },
    orderBy: { timestamp: "desc" },
    include: { agent: true },
    take: 100,
  });

  return (
    <div>
      <Reveal immediate>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Action Ledger</h1>
          <p className="text-foreground/70">
            Immutable audit trail of all agent operations
          </p>
        </div>
      </Reveal>

      <Reveal immediate delay={0.1}>
        <GlassCard className="p-6 mb-6" immediate>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <FileText className="w-6 h-6 text-accent-teal" />
            <div>
              <p className="font-bold text-xl">{entries.length}</p>
              <p className="text-sm text-foreground/60">Total entries logged</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 glass-morphism-light rounded-lg hover:bg-white/20 transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
        </GlassCard>
      </Reveal>

      <div className="space-y-3">
        {entries.map((entry, index) => (
          <Reveal immediate key={entry.id} delay={0.2} index={index} stagger={60}>
            <GlassCard className="p-4" immediate>
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <p className="font-medium">{entry.agent?.name ?? 'Unknown'}</p>
                  <span className="text-xs text-foreground/50">
                    {new Date(entry.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-foreground/70 mb-2">{entry.action}</p>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-accent-teal/10 text-accent-teal rounded text-xs font-mono">
                    {entry.scope}
                  </span>
                  {entry.result && (
                    <span className="px-2 py-1 bg-green-500/10 text-green-400 rounded text-xs">
                      Success
                    </span>
                  )}
                </div>
              </div>
            </div>
            {entry.metadata && (
              <div className="mt-3 pt-3 border-t border-white/10">
                <p className="text-xs text-foreground/50 font-mono">
                  {entry.metadata}
                </p>
              </div>
            )}
            </GlassCard>
          </Reveal>
        ))}

        {entries.length === 0 && (
          <Reveal immediate delay={0.2}>
            <GlassCard className="p-12 text-center" immediate>
            <FileText className="w-12 h-12 mx-auto mb-4 text-foreground/30" />
            <p className="text-foreground/60">
              No actions logged yet. Agent operations will appear here.
            </p>
            </GlassCard>
          </Reveal>
        )}
      </div>
    </div>
  );
}
