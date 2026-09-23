import { prisma } from "@/lib/prisma";
import GlassCard from "@/components/GlassCard";
import Button from "@/components/Button";
import Reveal from "@/components/motion/Reveal";
import { Brain, Database, Code2, Shield } from "lucide-react";

const agentIcons = {
  Lead: Brain,
  Memory: Database,
  Code: Code2,
  Guardian: Shield,
};

export default async function AgentsPage() {
  const agents = await prisma.agent.findMany({
    include: {
      _count: {
        select: {
          tokens: true,
          ledgerEntries: true,
        },
      },
    },
  });

  return (
    <div>
      <Reveal>
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Agents</h1>
            <p className="text-foreground/70">
              Your specialized agent fleet with defined capabilities
            </p>
          </div>
          <Button href="/app/agents/new" variant="primary">
            Create New Agent
          </Button>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {agents.map((agent, index) => {
          const Icon = agentIcons[agent.name as keyof typeof agentIcons] || Brain;
          return (
            <Reveal key={agent.id} delay={0.1} index={index} stagger={80}>
              <GlassCard className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-teal to-accent-blue flex items-center justify-center flex-shrink-0">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold">{agent.name}</h3>
                    <span
                      className={`px-3 py-1 rounded-lg text-xs ${
                        agent.isActive
                          ? "bg-green-500/20 text-green-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {agent.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-foreground/70 text-sm">{agent.description}</p>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-semibold text-accent-teal mb-2">
                  Capabilities
                </h4>
                <div className="flex flex-wrap gap-2">
                  {agent.capabilities.split(",").map((cap, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs font-mono"
                    >
                      {cap.trim()}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div>
                  <p className="text-sm text-foreground/60">Active Tokens</p>
                  <p className="text-2xl font-bold text-accent-teal">
                    {agent._count.tokens}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-foreground/60">Actions Logged</p>
                  <p className="text-2xl font-bold text-accent-blue">
                    {agent._count.ledgerEntries}
                  </p>
                </div>
              </div>
              </GlassCard>
            </Reveal>
          );
        })}
      </div>

      {agents.length === 0 && (
        <Reveal delay={0.1}>
          <GlassCard className="p-12 text-center">
          <p className="text-foreground/60">
            No agents configured yet. Initialize your agent fleet to get started.
          </p>
          </GlassCard>
        </Reveal>
      )}
    </div>
  );
}
