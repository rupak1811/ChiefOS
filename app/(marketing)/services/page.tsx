"use client";

import { motion } from "framer-motion";
import GlassCard from "@/components/GlassCard";
import { Brain, Database, Code2, Shield } from "lucide-react";

const services = [
  {
    icon: Brain,
    title: "Lead Agent",
    description: "The orchestrator of your agent fleet. Lead understands your goals, creates plans, and delegates tasks to specialist agents.",
    capabilities: [
      "Natural language task understanding",
      "Multi-step planning and coordination",
      "Rule-based execution (no API key required)",
      "Optional LLM integration for advanced reasoning",
    ],
    scopes: ["plan:create", "task:delegate", "agent:coordinate"],
  },
  {
    icon: Database,
    title: "Memory Agent",
    description: "Persistent knowledge store for your organization. Remembers preferences, context, and learned information across sessions.",
    capabilities: [
      "Key-value memory storage",
      "Context retrieval for other agents",
      "User preference management",
      "Cross-session persistence",
    ],
    scopes: ["memory:read", "memory:write"],
  },
  {
    icon: Code2,
    title: "Code Agent",
    description: "Sandboxed code execution and file operations. Writes, runs, and manages code with your explicit approval for sensitive changes.",
    capabilities: [
      "Sandboxed file system operations",
      "Code generation and execution",
      "Git integration and version control",
      "Approval-gated write operations",
    ],
    scopes: ["code:read", "code:write", "sandbox:execute"],
  },
  {
    icon: Shield,
    title: "Guardian Agent",
    description: "Security monitor that validates all operations, enforces policies, and maintains the action ledger for complete transparency.",
    capabilities: [
      "Permission scope validation",
      "Security policy enforcement",
      "Action ledger management",
      "Anomaly detection and alerting",
    ],
    scopes: ["security:validate", "ledger:write", "policy:enforce"],
  },
];

export default function ServicesPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Our <span className="text-gradient">Services</span>
          </h1>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
            A specialized fleet of intelligent agents, each with defined
            capabilities and strict permission boundaries.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <GlassCard key={index} hover className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-teal to-accent-blue flex items-center justify-center flex-shrink-0">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                    <p className="text-foreground/70">{service.description}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold mb-3 text-accent-teal">
                    Capabilities
                  </h4>
                  <ul className="space-y-2">
                    {service.capabilities.map((capability, i) => (
                      <li key={i} className="flex items-start text-sm">
                        <span className="text-accent-blue mr-2">•</span>
                        <span className="text-foreground/80">{capability}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 text-accent-blue">
                    Permission Scopes
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {service.scopes.map((scope, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-mono"
                      >
                        {scope}
                      </span>
                    ))}
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <GlassCard className="p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">
                  Enterprise-Grade Security
                </h2>
                <p className="text-foreground/70 mb-6">
                  Every agent operation flows through our permission system.
                  Sensitive scopes like <code className="px-2 py-1 bg-white/10 rounded">code:write</code> and{" "}
                  <code className="px-2 py-1 bg-white/10 rounded">send:*</code>{" "}
                  require explicit approval in your dashboard.
                </p>
                <a
                  href="/how-we-work"
                  className="text-accent-teal hover:text-accent-blue transition-colors"
                >
                  Learn about our process →
                </a>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 glass-morphism rounded-xl">
                  <span className="text-sm">Capability Tokens</span>
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs">
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 glass-morphism rounded-xl">
                  <span className="text-sm">Approval Queue</span>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs">
                    Monitored
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 glass-morphism rounded-xl">
                  <span className="text-sm">Action Ledger</span>
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-xs">
                    Logging
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 glass-morphism rounded-xl">
                  <span className="text-sm">Kill Switch</span>
                  <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg text-xs">
                    Ready
                  </span>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
