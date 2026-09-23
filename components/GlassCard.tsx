"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { useRipple } from "@/components/motion/Ripple";
import { cardAnimation, MOTION } from "@/lib/motion";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  shimmer?: boolean;
  heavy?: boolean;
  interactive?: boolean;
  immediate?: boolean;
}

export default function GlassCard({ 
  children, 
  className = "", 
  hover = false,
  shimmer = false,
  heavy = false,
  interactive = false,
  immediate = false,
}: GlassCardProps) {
  const spawnRipple = useRipple();
  
  const baseClass = heavy ? "water-glass water-glass--heavy" : "water-glass";
  
  const animationProps = immediate
    ? {
        initial: { opacity: 1, y: 0 },
        animate: { opacity: 1, y: 0 },
      }
    : cardAnimation;
  
  return (
    <motion.div
      {...animationProps}
      className={`${baseClass} p-6 ${
        shimmer ? "card-shimmer" : ""
      } ${interactive ? "relative overflow-hidden cursor-pointer" : ""} ${
        hover ? "hover:-translate-y-0.5 hover:scale-[1.005] transition-all" : ""
      } ${className}`}
      onPointerDown={interactive ? spawnRipple : undefined}
      style={
        hover
          ? {
              transitionDuration: `${MOTION.duration.hover}ms`,
              transitionTimingFunction: MOTION.easing.fluidCubic,
            }
          : undefined
      }
    >
      {children}
    </motion.div>
  );
}
