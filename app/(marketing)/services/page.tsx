"use client";

import { motion } from "framer-motion";
import GlassCard from "@/components/GlassCard";
import { Brain, Database, Code2, Shield } from "lucide-react";

const services = [
  {
    icon: Brain,
    image: "/cards/card-01-orchestration.png",
    title: "Multi-agent operations",
    description: "Stand up specialist agents for mail, chat, code, design, and ops. Each works in its lane; Lead keeps the thread.",
    capabilities: [
      "Natural language task understanding",
      "Multi-step planning and co-ordination",
      "Rule-based execution (no API key required)",
      "Optional LLM integration for advanced reasoning",
    ],
    scopes: ["plan:create", "task:delegate", "agent:coordinate"],
  },
  {
    icon: Shield,
    image: "/cards/card-02-permissions.png",
    title: "Permissioned control",
    description: "Approvals before send, deploy, or spend. Agents draft and prepare; you decide what leaves the building.",
    capabilities: [
      "Approval queue for sensitive operations",
      "Capability tokens with scoped permissions",
      "Time-bound expiry for all tokens",
      "Granular control over agent actions",
    ],
    scopes: ["approval:required", "token:validate", "permission:enforce"],
  },
  {
    icon: Code2,
    image: "/cards/card-03-approval.png",
    title: "Liquid-glass marketing site",
    description: "A polished public face for ChiefOS: clear offers, fast contact, and copy that matches how the product actually runs.",
    capabilities: [
      "iOS-inspired frosted glass design",
      "Smooth spring animations",
      "Mobile responsive layout",
      "Professional brand presentation",
    ],
    scopes: ["public:read", "contact:submit", "marketing:view"],
  },
  {
    icon: Database,
    image: "/cards/card-04-trust.png",
    title: "Custom agent desks",
    description: "Need a desk for a new workflow? We shape role, tools, and hand-offs so it fits your stack without noise.",
    capabilities: [
      "Bespoke agent configuration",
      "Custom tool integration",
      "Workflow-specific permissions",
      "Tailored to your stack",
    ],
    scopes: ["custom:configure", "desk:create", "workflow:integrate"],
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
            <span className="text-gradient">Services</span>
          </h1>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
            A specialised fleet of intelligent agents, each with defined
            capabilities and strict permission boundaries.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <GlassCard key={index} hover className="p-0 overflow-hidden">
                {service.image && (
                  <div className="relative h-64 w-full overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-base via-base/50 to-transparent" />
                  </div>
                )}
                <div className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center flex-shrink-0">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                      <p className="text-ink-muted">{service.description}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold mb-3 text-accent">
                      Capabilities
                    </h4>
                    <ul className="space-y-2">
                      {service.capabilities.map((capability, i) => (
                        <li key={i} className="flex items-start text-sm">
                          <span className="text-accent mr-2">•</span>
                          <span className="text-ink-muted">{capability}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 text-accent">
                      Permission Scopes
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {service.scopes.map((scope, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 glass border-glass-border rounded-lg text-xs font-mono"
                        >
                          {scope}
                        </span>
                      ))}
                    </div>
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
                  Enterprise-grade security
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
                  See how it works →
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
