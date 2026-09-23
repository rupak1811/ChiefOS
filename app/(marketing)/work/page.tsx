"use client";

import { motion } from "framer-motion";
import GlassCard from "@/components/GlassCard";
import { ExternalLink } from "lucide-react";

const projects = [
  {
    title: "Enterprise Automation Platform",
    category: "Agent Integration",
    description: "Deployed ChiefOS to automate workflow approvals and document processing for a Fortune 500 company.",
    metrics: ["500+ daily tasks", "99.8% uptime", "40% cost reduction"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
  },
  {
    title: "Smart Customer Support",
    category: "AI Agents",
    description: "Built multi-agent system for customer query routing, response generation, and escalation management.",
    metrics: ["10k+ queries/day", "85% auto-resolution", "2min avg response"],
    image: "https://images.unsplash.com/photo-1556742400-b5b7c256c4ab?w=800&h=600&fit=crop",
  },
  {
    title: "Code Review Assistant",
    category: "Development Tools",
    description: "Integrated ChiefOS Code agent into CI/CD pipeline for automated code review and security scanning.",
    metrics: ["50+ repos", "2000+ reviews/week", "60% faster merge"],
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop",
  },
  {
    title: "Research Data Pipeline",
    category: "Data Processing",
    description: "Orchestrated agent fleet for data collection, validation, and analysis with human-in-the-loop approvals.",
    metrics: ["5TB processed", "3x faster pipeline", "Zero data loss"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
  },
];

export default function WorkPage() {
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
            Our <span className="text-gradient">Work</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-foreground/70 max-w-3xl mx-auto px-2">
            Real-world applications of ChiefOS across industries, delivering
            measurable results with intelligent automation.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {projects.map((project, index) => (
            <GlassCard key={index} hover className="overflow-hidden p-0">
              <div className="relative h-40 sm:h-48 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                  <span className="px-2 sm:px-3 py-1 glass-morphism-light rounded-full text-xs sm:text-sm">
                    {project.category}
                  </span>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 flex items-center flex-wrap">
                  <span className="mr-2">{project.title}</span>
                  <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 text-accent-teal" />
                </h3>
                <p className="text-sm sm:text-base text-foreground/70 mb-3 sm:mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.metrics.map((metric, i) => (
                    <span
                      key={i}
                      className="px-2 sm:px-3 py-1 bg-accent-teal/10 text-accent-teal rounded-lg text-xs sm:text-sm"
                    >
                      {metric}
                    </span>
                  ))}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 sm:mt-16 md:mt-20 text-center"
        >
          <GlassCard className="p-6 sm:p-8 md:p-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
              Ready to start your project?
            </h2>
            <p className="text-sm sm:text-base text-foreground/70 mb-4 sm:mb-6 max-w-2xl mx-auto">
              Let's discuss how ChiefOS can transform your operations with
              intelligent, permissioned agents.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-accent-teal to-accent-blue text-white rounded-xl hover:shadow-lg hover:shadow-accent-teal/50 transition-all text-sm sm:text-base"
            >
              Get in Touch
            </a>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
