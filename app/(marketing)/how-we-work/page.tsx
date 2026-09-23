"use client";

import { motion } from "framer-motion";
import GlassCard from "@/components/GlassCard";
import { Search, FileText, Cpu, CheckSquare, Rocket } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Scope the desks",
    description: "Map jobs that need an agent and approvals that must stay human.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: FileText,
    title: "Wire roles and tools",
    description: "Clear brief, right connectors, hard limits on solo actions.",
    color: "from-cyan-500 to-teal-500",
  },
  {
    icon: Cpu,
    title: "Run under Lead",
    description: "Lead co-ordinates hand-offs, flags blockers, keeps delivery moving.",
    color: "from-teal-500 to-green-500",
  },
  {
    icon: CheckSquare,
    title: "Tighten from real traffic",
    description: "Refine prompts, routines, and copy from live work.",
    color: "from-green-500 to-emerald-500",
  },
];

export default function HowWeWorkPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-12 md:mb-16"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
            How it <span className="text-gradient">works</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-foreground/70 max-w-3xl mx-auto px-2">
            Our proven process ensures safe, effective agent deployment with
            human oversight at every critical step.
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent-teal via-accent-blue to-accent-teal hidden lg:block" />

          <div className="space-y-10 sm:space-y-12 md:space-y-16">
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
                  className={`flex flex-col lg:flex-row items-center gap-6 sm:gap-8 ${
                    isEven ? "" : "lg:flex-row-reverse"
                  }`}
                >
                  <div className="flex-1">
                    <GlassCard hover className="p-4 sm:p-6 md:p-8">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div
                          className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center flex-shrink-0`}
                        >
                          <Icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3">
                            {index + 1}. {step.title}
                          </h3>
                          <p className="text-sm sm:text-base text-foreground/70">{step.description}</p>
                        </div>
                      </div>
                    </GlassCard>
                  </div>

                  <div className="hidden lg:flex w-8 h-8 rounded-full bg-gradient-to-br from-accent-teal to-accent-blue flex-shrink-0 items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-white" />
                  </div>

                  <div className="flex-1 hidden lg:block" />
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
          className="mt-12 sm:mt-16 md:mt-20"
        >
          <GlassCard className="p-6 sm:p-8 md:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Safety First</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-left">
              <div>
                <h3 className="font-bold text-base sm:text-lg mb-2 text-accent-teal">
                  Capability Tokens
                </h3>
                <p className="text-foreground/70 text-xs sm:text-sm">
                  Every agent operates with scoped tokens that define exactly what
                  they can and cannot do, with automatic expiry.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg mb-2 text-accent-blue">
                  Approval Queue
                </h3>
                <p className="text-foreground/70 text-xs sm:text-sm">
                  Sensitive operations (code:write, send:*) require explicit human
                  approval before execution.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg mb-2 text-accent-teal">
                  Kill Switch
                </h3>
                <p className="text-foreground/70 text-xs sm:text-sm">
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
