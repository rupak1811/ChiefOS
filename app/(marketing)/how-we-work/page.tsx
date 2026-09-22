"use client";

import { motion } from "framer-motion";
import GlassCard from "@/components/GlassCard";
import { Search, FileText, Cpu, CheckSquare, Rocket } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Discover",
    description: "We start by understanding your needs, workflows, and pain points. Our team analyzes your current processes to identify automation opportunities.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: FileText,
    title: "Plan",
    description: "Together, we design a custom agent configuration with clearly defined capabilities, permissions, and approval workflows tailored to your requirements.",
    color: "from-cyan-500 to-teal-500",
  },
  {
    icon: Cpu,
    title: "Agents Execute",
    description: "Our specialized agents (Lead, Memory, Code, Guardian) work autonomously within their permitted scopes, requesting approvals for sensitive operations.",
    color: "from-teal-500 to-green-500",
  },
  {
    icon: CheckSquare,
    title: "You Approve",
    description: "Critical actions flow through your approval queue. You maintain full control with clear visibility into what each agent wants to do and why.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Rocket,
    title: "Ship",
    description: "Once approved, agents execute immediately. Every action is logged in an immutable ledger, providing complete audit trails and transparency.",
    color: "from-emerald-500 to-blue-500",
  },
];

export default function HowWeWorkPage() {
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
            How We <span className="text-gradient">Work</span>
          </h1>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
            Our proven process ensures safe, effective agent deployment with
            human oversight at every critical step.
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent-teal via-accent-blue to-accent-teal hidden md:block" />

          <div className="space-y-16">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`flex flex-col md:flex-row items-center gap-8 ${
                    isEven ? "" : "md:flex-row-reverse"
                  }`}
                >
                  <div className="flex-1">
                    <GlassCard hover className="p-8">
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center flex-shrink-0`}
                        >
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold mb-3">
                            {index + 1}. {step.title}
                          </h3>
                          <p className="text-foreground/70">{step.description}</p>
                        </div>
                      </div>
                    </GlassCard>
                  </div>

                  <div className="hidden md:flex w-8 h-8 rounded-full bg-gradient-to-br from-accent-teal to-accent-blue flex-shrink-0 items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-white" />
                  </div>

                  <div className="flex-1 hidden md:block" />
                </motion.div>
              );
            })}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20"
        >
          <GlassCard className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-6">Safety First</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <div>
                <h3 className="font-bold text-lg mb-2 text-accent-teal">
                  Capability Tokens
                </h3>
                <p className="text-foreground/70 text-sm">
                  Every agent operates with scoped tokens that define exactly what
                  they can and cannot do, with automatic expiry.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2 text-accent-blue">
                  Approval Queue
                </h3>
                <p className="text-foreground/70 text-sm">
                  Sensitive operations (code:write, send:*) require explicit human
                  approval before execution.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2 text-accent-teal">
                  Kill Switch
                </h3>
                <p className="text-foreground/70 text-sm">
                  One click to instantly halt all agent operations across your
                  entire fleet. Full control, always.
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
