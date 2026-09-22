"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  shimmer?: boolean;
}

export default function GlassCard({ 
  children, 
  className = "", 
  hover = false,
  shimmer = false 
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={hover ? { y: -8, scale: 1.02 } : {}}
      className={`glass-morphism-light rounded-2xl p-6 transition-all duration-300 ${
        shimmer ? "card-shimmer" : ""
      } ${className}`}
    >
      {children}
    </motion.div>
  );
}
