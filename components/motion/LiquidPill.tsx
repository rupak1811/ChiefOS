"use client";

import { motion, useReducedMotion } from "framer-motion";
import { fluidTransition } from "@/lib/motion";

/**
 * Shared liquid pill indicator for nav, sidebar, tabs, filters
 * Per GLOBAL_WATER_MOTION.md: one layoutId per contiguous group
 * 
 * Usage:
 * - Use unique layoutId per group (e.g., "nav-liquid", "sidebar-liquid", "tabs-liquid")
 * - Render conditionally under active/hovered item
 * - Same spring as NAV_UX: stiffness 380, damping 36
 */

interface LiquidPillProps {
  layoutId: string;
  variant?: "nav" | "sidebar" | "tab" | "filter";
  className?: string;
}

export default function LiquidPill({ 
  layoutId, 
  variant = "nav",
  className = "" 
}: LiquidPillProps) {
  const prefersReducedMotion = useReducedMotion();

  const variantStyles = {
    nav: {
      background: "rgba(45, 212, 191, 0.12)",
      border: "1px solid rgba(255, 255, 255, 0.16)",
      boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.35), 0 0 24px rgba(45, 212, 191, 0.15)",
      backdropFilter: "blur(12px) saturate(160%)",
    },
    sidebar: {
      background: "linear-gradient(90deg, #2DD4BF, #5EEAD4)",
    },
    tab: {
      background: "rgba(45, 212, 191, 0.12)",
      border: "1px solid rgba(255, 255, 255, 0.16)",
      backdropFilter: "blur(8px) saturate(150%)",
    },
    filter: {
      background: "rgba(45, 212, 191, 0.10)",
      border: "1px solid rgba(255, 255, 255, 0.14)",
    },
  };

  return (
    <motion.div
      layoutId={layoutId}
      className={`absolute inset-0 rounded-full ${className}`}
      style={{
        ...variantStyles[variant],
        pointerEvents: "none",
        zIndex: 0,
      }}
      initial={false}
      transition={
        prefersReducedMotion
          ? { duration: 0.01 }
          : fluidTransition
      }
    />
  );
}
