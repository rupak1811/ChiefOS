"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { useRipple } from "@/lib/useRipple";
import { cardAnimation, fluidTransition } from "@/lib/motion";

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
      {...cardAnimation}
      className={`${baseClass} p-6 ${
        shimmer ? "card-shimmer" : ""
      } ${interactive ? "relative overflow-hidden" : ""} ${className}`}
      onPointerDown={interactive ? spawnRipple : undefined}
      style={hover ? fluidTransition : undefined}
    >
      {children}
    </motion.div>
  );
}
