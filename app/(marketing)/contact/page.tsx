"use client";

import { motion } from "framer-motion";
import GlassCard from "@/components/GlassCard";
import { useState } from "react";
import { Mail, MessageSquare, Building2 } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", company: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <div className="relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-gradient">Talk to us</span>
          </h1>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
            Tell us what you need built or co-ordinated. We reply within one business day.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <GlassCard className="text-center p-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-teal to-accent-blue flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold mb-2">Email</h3>
            <p className="text-foreground/70 text-sm">hello@chiefos.dev</p>
          </GlassCard>

          <GlassCard className="text-center p-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-teal to-accent-blue flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold mb-2">Support</h3>
            <p className="text-foreground/70 text-sm">24/7 via dashboard</p>
          </GlassCard>

          <GlassCard className="text-center p-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-teal to-accent-blue flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold mb-2">Enterprise</h3>
            <p className="text-foreground/70 text-sm">Custom solutions</p>
          </GlassCard>
        </div>

        <GlassCard className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-teal transition-all"
                placeholder=""
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Work email
              </label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-teal transition-all"
                placeholder=""
              />
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium mb-2">
                Company <span className="text-foreground/50">(optional)</span>
              </label>
              <input
                type="text"
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-teal transition-all"
                placeholder=""
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                What do you need help with?
              </label>
              <textarea
                id="message"
                required
                rows={6}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-teal transition-all resize-none"
                placeholder="e.g. Multi-agent setup for product ops, or a marketing site for our agent stack"
              />
            </div>

            {status === "success" && (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm">
                Message received. We'll be in touch shortly.
              </div>
            )}

            {status === "error" && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                Something went wrong. Try again, or email us directly.
              </div>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full px-8 py-4 bg-gradient-to-r from-accent-teal to-accent-blue text-white rounded-xl hover:shadow-lg hover:shadow-accent-teal/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {status === "loading" ? "Sending..." : "Send message"}
            </button>
          </form>
        </GlassCard>
      </div>
    </div>
  );
}
