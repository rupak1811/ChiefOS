"use client";

import { motion, useReducedMotion } from "framer-motion";
import { signIn } from "next-auth/react";
import Button from "@/components/Button";
import GlassCard from "@/components/GlassCard";
import ImageCarousel from "@/components/ImageCarousel";
import { MOTION, sectionAnimation } from "@/lib/motion";
import { Sparkles, Shield, Zap, CheckCircle } from "lucide-react";

export default function HomePage() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-teal/20 rounded-full blur-3xl"
          animate={
            prefersReducedMotion
              ? {}
              : {
                  y: [0, -30, 0],
                  x: [0, 20, 0],
                  scale: [1, 1.1, 1],
                }
          }
          transition={{
            duration: 12,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-blue/20 rounded-full blur-3xl"
          animate={
            prefersReducedMotion
              ? {}
              : {
                  y: [0, 40, 0],
                  x: [0, -25, 0],
                  scale: [1, 1.15, 1],
                }
          }
          transition={{
            duration: 14,
            ease: "easeInOut",
            repeat: Infinity,
            delay: 2,
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { duration: 0.8, ease: MOTION.easing.fluid }
            }
          >
            <h1 className="font-display text-display mb-6 text-balance">
              Run a permissioned agent workforce from one{" "}
              <span className="text-grad-brand">glass</span> desk.
            </h1>
            <p className="text-body text-ink-muted max-w-3xl mx-auto mb-8 text-balance">
              ChiefOS co-ordinates specialised agents under clear roles and approvals. You set the brief; they execute within the guardrails you define.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                onClick={() => signIn("google", { callbackUrl: "/app" })} 
                variant="primary" 
                size="lg"
              >
                Get Started
              </Button>
              <Button href="/how-we-work" variant="secondary" size="lg">
                See how it works
              </Button>
            </div>
          </motion.div>
        </section>

        <section className="py-12">
          <ImageCarousel />
        </section>

        <section className="py-20">
          <motion.h2
            {...sectionAnimation}
            className="font-display text-h2 text-center mb-12"
          >
            Why ChiefOS?
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <GlassCard hover shimmer>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-display text-h3 mb-2">Multi-agent operations</h3>
                <p className="text-body-sm text-ink-muted">
                  Stand up specialist agents for mail, chat, code, design, and ops. Each works in its lane; Lead keeps the thread.
                </p>
              </div>
            </GlassCard>

            <GlassCard hover shimmer>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-display text-h3 mb-2">Permissioned control</h3>
                <p className="text-body-sm text-ink-muted">
                  Approvals before send, deploy, or spend. Agents draft and prepare; you decide what leaves the building.
                </p>
              </div>
            </GlassCard>

            <GlassCard hover shimmer>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-teal to-accent-blue flex items-center justify-center mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Liquid-glass marketing site</h3>
                <p className="text-foreground/70">
                  A polished public face for ChiefOS: clear offers, fast contact, and copy that matches how the product actually runs.
                </p>
              </div>
            </GlassCard>
          </div>
        </section>

        <section className="py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              {...sectionAnimation}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Custom agent desks
              </h2>
              <p className="text-foreground/70 mb-8">
                Need a desk for a new workflow? We shape role, tools, and hand-offs so it fits your stack without noise.
              </p>
              <ul className="space-y-4">
                {[
                  "Approval queue for sensitive operations",
                  "Global kill switch for instant shutdown",
                  "Capability tokens with time-bound expiry",
                  "Rule-based planning (no API keys required)",
                ].map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-accent-teal mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/80">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              {...sectionAnimation}
            >
              <GlassCard className="p-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                    <span className="text-sm text-foreground/70">Status</span>
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                    <span className="text-sm text-foreground/70">Agents</span>
                    <span className="font-mono text-accent-teal">4</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                    <span className="text-sm text-foreground/70">Actions Logged</span>
                    <span className="font-mono text-accent-blue">142</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                    <span className="text-sm text-foreground/70">Approvals Pending</span>
                    <span className="font-mono text-yellow-400">0</span>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </section>

        <section className="py-20 text-center">
          <motion.div
            {...sectionAnimation}
            className="glass-morphism-light rounded-3xl p-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to get started?
            </h2>
            <p className="text-xl text-foreground/70 mb-8 max-w-2xl mx-auto">
              Sign in with Google to start co-ordinating your agent workforce with ChiefOS.
            </p>
            <Button 
              onClick={() => signIn("google", { callbackUrl: "/app" })} 
              variant="primary" 
              size="lg"
            >
              Get Started
            </Button>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
