"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { useRipple } from "@/lib/useRipple";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  shimmer?: boolean;
  heavy?: boolean;
  interactive?: boolean;
}

export default function GlassCard({ 
  children, 
  className = "", 
  hover = false,
  shimmer = false,
  heavy = false,
  interactive = false,
}: GlassCardProps) {
  const spawnRipple = useRipple();
  
  const baseClass = heavy ? "water-glass water-glass--heavy" : "water-glass";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.6, 
        ease: [0.22, 1, 0.36, 1] 
      }}
      className={`${baseClass} p-6 ${
        shimmer ? "card-shimmer" : ""
      } ${className}`}
      onPointerDown={interactive ? spawnRipple : undefined}
      style={{
        transition: hover 
          ? "all 520ms cubic-bezier(0.22, 1, 0.36, 1)" 
          : undefined
      }}
    >
      {children}
    </motion.div>
  );
}
