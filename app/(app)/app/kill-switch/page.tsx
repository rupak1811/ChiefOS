import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import GlassCard from "@/components/GlassCard";
import KillSwitchToggle from "@/components/KillSwitchToggle";
import { AlertTriangle, Shield } from "lucide-react";

export default async function KillSwitchPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/api/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { killSwitch: true },
  });

  const isEnabled = user?.killSwitch || false;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <AlertTriangle className="w-8 h-8 text-red-400" />
          Kill Switch
        </h1>
        <p className="text-foreground/70">
          Emergency control to instantly disable all agent operations
        </p>
      </div>

      <div className="max-w-3xl">
        <GlassCard className={`p-8 mb-6 border-2 ${
          isEnabled ? "border-red-500/50" : "border-green-500/50"
        }`}>
          <div className="text-center mb-6">
            <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4 ${
              isEnabled
                ? "bg-red-500/20 animate-pulse"
                : "bg-green-500/20"
            }`}>
              <Shield className={`w-12 h-12 ${
                isEnabled ? "text-red-400" : "text-green-400"
              }`} />
            </div>
            <h2 className="text-2xl font-bold mb-2">
              {isEnabled ? "Paused" : "System Active"}
            </h2>
            <p className="text-foreground/70">
              {isEnabled
                ? "Kill switch is on. Approvals will not run until you resume."
                : "Agents are operational and can execute approved actions."}
            </p>
          </div>

          <div className="flex justify-center">
            <KillSwitchToggle isEnabled={isEnabled} />
          </div>
        </GlassCard>

        <GlassCard className="p-6" immediate>
          <h3 className="font-bold text-lg mb-4">How it works</h3>
          <div className="space-y-3 text-sm text-foreground/70">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-accent-teal mt-1.5 flex-shrink-0" />
              <p>
                <strong className="text-foreground">Instant shutdown:</strong>{" "}
                Activating the kill switch immediately halts all agent operations
                across your fleet
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-accent-teal mt-1.5 flex-shrink-0" />
              <p>
                <strong className="text-foreground">Blocks all actions:</strong>{" "}
                No agent can execute any operation, regardless of approval status
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-accent-teal mt-1.5 flex-shrink-0" />
              <p>
                <strong className="text-foreground">Reversible:</strong>{" "}
                You can re-enable agents at any time by toggling the switch back
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-accent-teal mt-1.5 flex-shrink-0" />
              <p>
                <strong className="text-foreground">Logged:</strong>{" "}
                All kill switch activations and deactivations are recorded in the ledger
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
