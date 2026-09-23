"use client";

import { motion, useReducedMotion } from "framer-motion";
import { MOTION, revealAnimation } from "@/lib/motion";
import { ReactNode } from "react";

/**
 * Scroll reveal wrapper component
 * Per GLOBAL_WATER_MOTION.md:
 * - opacity 0→1, y 20→0, optional blur 6px→0
 * - 600ms fluid easing
 * - Intersection Observer once
 * - Respects prefers-reduced-motion
 */

interface RevealProps {
  children: ReactNode;
  delay?: number;
  stagger?: number;
  index?: number;
  className?: string;
  disableBlur?: boolean;
  immediate?: boolean;
}

export default function Reveal({ 
  children, 
  delay = 0,
  stagger = 0,
  index = 0,
  className = "",
  disableBlur = false,
  immediate = false,
}: RevealProps) {
  const prefersReducedMotion = useReducedMotion();
  
  const totalDelay = delay + (stagger * index);

  // Skip animation wrapper entirely for immediate mode or reduced motion
  if (prefersReducedMotion || immediate) {
    return <div className={className}>{children}</div>;
  }

  const initialState = disableBlur
    ? { opacity: 0, y: 20 }
    : revealAnimation.initial;
  
  const animateState = disableBlur
    ? { opacity: 1, y: 0 }
    : revealAnimation.whileInView;

  return (
    <motion.div
      className={className}
      initial={initialState}
      whileInView={animateState}
      viewport={revealAnimation.viewport}
      transition={{
        ...revealAnimation.transition,
        delay: totalDelay,
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Staggered reveal for lists/grids
 * Per spec: 60-80ms stagger
 */
interface StaggerRevealProps {
  children: ReactNode[];
  stagger?: number;
  className?: string;
}

export function StaggerReveal({ 
  children, 
  stagger = 70,
  className = "" 
}: StaggerRevealProps) {
  return (
    <>
      {children.map((child, index) => (
        <Reveal key={index} index={index} stagger={stagger / 1000} className={className}>
          {child}
        </Reveal>
      ))}
    </>
  );
}
