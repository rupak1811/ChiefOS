"use client";

import { motion, useReducedMotion } from "framer-motion";
import { MOTION } from "@/lib/motion";

/**
 * Route transition wrapper
 * Per GLOBAL_WATER_MOTION.md:
 * - Leaving: opacity 1→0, y 0→-8, blur 0→6px, 280ms
 * - Entering: opacity 0→1, y 12→0, blur 6px→0, 480ms fluid
 */

interface PageFadeProps {
  children: React.ReactNode;
}

export default function PageFade({ children }: PageFadeProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={MOTION.variants.routeEnter.initial}
      animate={MOTION.variants.routeEnter.animate}
      exit={MOTION.variants.routeExit}
      transition={MOTION.tween.route}
    >
      {children}
    </motion.div>
  );
}
