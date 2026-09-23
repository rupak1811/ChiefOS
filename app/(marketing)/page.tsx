"use client";

import { motion, useReducedMotion } from "framer-motion";
import { signIn } from "next-auth/react";
import Button from "@/components/Button";
import GlassCard from "@/components/GlassCard";
import ImageCarousel from "@/components/ImageCarousel";
import Reveal from "@/components/motion/Reveal";
import { MOTION } from "@/lib/motion";
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
        <section className="py-12 sm:py-16 md:py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { duration: 0.8, ease: MOTION.easing.fluid }
            }
          >
            <h1 className="font-display text-display mb-4 sm:mb-6 text-balance px-2">
              Run a permissioned agent workforce from one{" "}
              <span className="text-grad-brand">glass</span> desk.
            </h1>
            <p className="text-body text-ink-muted max-w-3xl mx-auto mb-6 sm:mb-8 text-balance px-4">
              ChiefOS co-ordinates specialised agents under clear roles and approvals. You set the brief; they execute within the guardrails you define.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 px-4">
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

        <section className="py-8 sm:py-12">
          <ImageCarousel />
        </section>

        <section className="py-12 sm:py-16 md:py-20">
          <Reveal>
            <h2 className="font-display text-h2 text-center mb-8 sm:mb-12 px-4">
              Why ChiefOS?
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
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

        <section className="py-12 sm:py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
            <Reveal>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 px-4 lg:px-0">
                Custom agent desks
              </h2>
              <p className="text-foreground/70 mb-6 sm:mb-8 px-4 lg:px-0">
                Need a desk for a new workflow? We shape role, tools, and hand-offs so it fits your stack without noise.
              </p>
              <ul className="space-y-3 sm:space-y-4 px-4 lg:px-0">
                {[
                  "Approval queue for sensitive operations",
                  "Global kill switch for instant shutdown",
                  "Capability tokens with time-bound expiry",
                  "Rule-based planning (no API keys required)",
                ].map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-accent-teal mr-2 sm:mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base text-foreground/80">{feature}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal>
              <GlassCard className="p-4 sm:p-6 md:p-8">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between p-3 sm:p-4 bg-white/5 rounded-xl">
                    <span className="text-xs sm:text-sm text-foreground/70">Status</span>
                    <span className="px-2 sm:px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs sm:text-sm">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 sm:p-4 bg-white/5 rounded-xl">
                    <span className="text-xs sm:text-sm text-foreground/70">Agents</span>
                    <span className="font-mono text-accent-teal">4</span>
                  </div>
                  <div className="flex items-center justify-between p-3 sm:p-4 bg-white/5 rounded-xl">
                    <span className="text-xs sm:text-sm text-foreground/70">Actions Logged</span>
                    <span className="font-mono text-accent-blue">142</span>
                  </div>
                  <div className="flex items-center justify-between p-3 sm:p-4 bg-white/5 rounded-xl">
                    <span className="text-xs sm:text-sm text-foreground/70">Approvals Pending</span>
                    <span className="font-mono text-yellow-400">0</span>
                  </div>
                </div>
              </GlassCard>
            </Reveal>
          </div>
        </section>

        <section className="py-12 sm:py-16 md:py-20 text-center">
          <Reveal>
            <div className="glass-morphism-light rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 mx-4 sm:mx-0">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
              Ready to get started?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-foreground/70 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Sign in with Google to start co-ordinating your agent workforce with ChiefOS.
            </p>
            <Button 
              onClick={() => signIn("google", { callbackUrl: "/app" })} 
              variant="primary" 
              size="lg"
            >
              Get Started
            </Button>
            </div>
          </Reveal>
        </section>
      </div>
    </div>
  );
}
