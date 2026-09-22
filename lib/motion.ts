/**
 * ChiefOS Water Glass Motion System
 * Centralized motion tokens, transitions, and utilities
 * Implements consistent liquid/water animations across the product
 */

export const MOTION = {
  // Durations (ms)
  duration: {
    instant: 0,
    fast: 150,
    medium: 280,
    fluid: 520,
    ripple: 700,
    settle: 900,
  },

  // Easing curves
  easing: {
    fluid: [0.22, 1, 0.36, 1] as const,
    fluidCubic: "cubic-bezier(0.22, 1, 0.36, 1)",
    spring: [0.34, 1.3, 0.64, 1] as const,
    easeOut: [0.16, 1, 0.3, 1] as const,
    easeInOut: [0.65, 0, 0.35, 1] as const,
  },

  // Spring configurations for Framer Motion
  spring: {
    // Water-like: smooth, thick liquid feel
    water: {
      type: "spring" as const,
      stiffness: 380,
      damping: 36,
      mass: 0.6,
    },
    // Navigation pill: ultra smooth
    nav: {
      type: "spring" as const,
      stiffness: 380,
      damping: 36,
      mass: 0.6,
    },
    // Interactive elements: responsive but smooth
    interactive: {
      type: "spring" as const,
      stiffness: 400,
      damping: 32,
      mass: 0.5,
    },
    // Gentle bounce for CTAs
    bounce: {
      type: "spring" as const,
      stiffness: 300,
      damping: 24,
      mass: 0.8,
    },
  },

  // Framer Motion transition presets
  transition: {
    fluid: {
      duration: 0.52,
      ease: [0.22, 1, 0.36, 1] as const,
    },
    medium: {
      duration: 0.28,
      ease: [0.22, 1, 0.36, 1] as const,
    },
    fast: {
      duration: 0.15,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },

  // Animation variants for common patterns
  variants: {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    fadeInUp: {
      initial: { opacity: 0, y: 24 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -12 },
    },
    fadeInScale: {
      initial: { opacity: 0, scale: 0.96 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.98 },
    },
    slideIn: {
      initial: { x: -20, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: 20, opacity: 0 },
    },
  },

  // Viewport animation defaults
  viewport: {
    once: true,
    amount: 0.2,
    margin: "-80px",
  },
} as const;

/**
 * Get reduced motion-aware transition config
 * Returns instant transition if user prefers reduced motion
 */
export function getTransition(
  transition: typeof MOTION.transition.fluid | typeof MOTION.spring.water,
  prefersReducedMotion: boolean = false
) {
  if (prefersReducedMotion) {
    return { duration: 0 };
  }
  return transition;
}

/**
 * Inline style for fluid transitions (use with style prop)
 */
export const fluidTransition = {
  transition: "all 520ms cubic-bezier(0.22, 1, 0.36, 1)",
};

/**
 * Inline style for color transitions
 */
export const colorTransition = {
  transition: "color 280ms cubic-bezier(0.22, 1, 0.36, 1)",
};

/**
 * Common section animation config
 */
export const sectionAnimation = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: MOTION.viewport,
  transition: MOTION.transition.fluid,
};

/**
 * Card enter animation config
 */
export const cardAnimation = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: MOTION.viewport,
  transition: {
    duration: 0.6,
    ease: MOTION.easing.fluid,
  },
};
