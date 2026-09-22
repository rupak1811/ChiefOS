"use client";

import { motion } from "framer-motion";
import Button from "@/components/Button";
import GlassCard from "@/components/GlassCard";
import ImageCarousel from "@/components/ImageCarousel";
import { Sparkles, Shield, Zap, CheckCircle } from "lucide-react";

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-teal/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-blue/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Your Agents,
              <br />
              <span className="text-gradient">Under Your Control</span>
            </h1>
            <p className="text-xl md:text-2xl text-foreground/70 max-w-3xl mx-auto mb-8">
              ChiefOS is a professional multi-agent operating system with permissioned
              capabilities, human oversight, and liquid-glass design.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button href="/services" variant="primary" size="lg">
                Explore Services
              </Button>
              <Button href="/api/auth/signin" variant="secondary" size="lg">
                Get Started
              </Button>
            </div>
          </motion.div>
        </section>

        <section className="py-12">
          <ImageCarousel />
        </section>

        <section className="py-20">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-12"
          >
            Why ChiefOS?
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <GlassCard hover shimmer>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-teal to-accent-blue flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Intelligent Agents</h3>
                <p className="text-foreground/70">
                  Lead, Memory, Code, and Guardian agents work together to execute
                  your tasks with precision.
                </p>
              </div>
            </GlassCard>

            <GlassCard hover shimmer>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-teal to-accent-blue flex items-center justify-center mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Permission Control</h3>
                <p className="text-foreground/70">
                  Every action requires your approval. Capability tokens with scopes
                  and expiry ensure safety.
                </p>
              </div>
            </GlassCard>

            <GlassCard hover shimmer>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-teal to-accent-blue flex items-center justify-center mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Transparent Ledger</h3>
                <p className="text-foreground/70">
                  Append-only action ledger tracks every operation. Full visibility
                  and audit trail.
                </p>
              </div>
            </GlassCard>
          </div>
        </section>

        <section className="py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Built for Professionals
              </h2>
              <p className="text-foreground/70 mb-8">
                ChiefOS gives you the power of autonomous agents with the safety
                of human oversight. Every capability is scoped, every action is
                logged, and you're always in control.
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
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
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
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-morphism-light rounded-3xl p-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to get started?
            </h2>
            <p className="text-xl text-foreground/70 mb-8 max-w-2xl mx-auto">
              Sign in with Google and start managing your agent fleet with
              ChiefOS today.
            </p>
            <Button href="/api/auth/signin" variant="primary" size="lg">
              Sign In with Google
            </Button>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
