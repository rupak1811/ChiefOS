/**
 * ChiefOS Global Water Motion System
 * Source of truth for all motion tokens and transitions
 * Implements GLOBAL_WATER_MOTION.md spec
 */

export const MOTION = {
  // Durations (ms) - per GLOBAL_WATER_MOTION spec
  duration: {
    instant: 0,
    press: 120,      // Button press scale
    medium: 280,     // Focus, nav scroll state
    hover: 520,      // Hover lift/scale
    ripple: 700,     // Water ripple from press
    route: 480,      // Route transitions
    scrollFade: 600, // Scroll reveal
  },

  // Easing curves
  easing: {
    fluid: [0.22, 1, 0.36, 1] as const,
    fluidCubic: "cubic-bezier(0.22, 1, 0.36, 1)",
    spring: [0.34, 1.3, 0.64, 1] as const,
    easeOut: [0.16, 1, 0.3, 1] as const,
  },

  // Spring configurations for Framer Motion
  spring: {
    // Thick water liquid morph - nav, sidebar, tabs
    fluid: {
      type: "spring" as const,
      stiffness: 380,
      damping: 36,
      mass: 0.55,
    },
  },

  // Tween configurations
  tween: {
    fluid: {
      duration: 0.52,
      ease: [0.22, 1, 0.36, 1] as const,
    },
    medium: {
      duration: 0.28,
      ease: [0.22, 1, 0.36, 1] as const,
    },
    press: {
      duration: 0.12,
      ease: [0.16, 1, 0.3, 1] as const,
    },
    route: {
      duration: 0.48,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },

  // Animation variants for common patterns
  variants: {
    // Route transitions
    routeExit: {
      opacity: 0,
      y: -8,
      filter: "blur(6px)",
    },
    routeEnter: {
      initial: { opacity: 0, y: 12, filter: "blur(6px)" },
      animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    },
    // Scroll reveal
    reveal: {
      initial: { opacity: 0, y: 20, filter: "blur(4px)" },
      animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    },
    // Modals
    modal: {
      initial: { opacity: 0, y: 16, scale: 0.98 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, y: 8, scale: 0.98 },
    },
    // Cards
    card: {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
    },
  },

  // Viewport animation defaults
  viewport: {
    once: true,
    amount: 0.2,
    margin: "-80px",
  },

  // Hover states for pressable elements
  hover: {
    lift: {
      y: -1,
      scale: 1.01,
    },
  },

  // Press states
  press: {
    scale: 0.98,
  },
} as const;

// Framer Motion presets (export for direct use)
export const fluidTransition = MOTION.spring.fluid;
export const fluidTween = MOTION.tween.fluid;

/**
 * Get reduced motion-aware transition config
 * Returns instant transition if user prefers reduced motion
 */
export function getTransition(
  transition: any,
  prefersReducedMotion: boolean = false
) {
  if (prefersReducedMotion) {
    return { duration: 0.01 };
  }
  return transition;
}

/**
 * Inline style for fluid transitions (use with style prop)
 */
export const fluidStyle = {
  transition: "all 520ms cubic-bezier(0.22, 1, 0.36, 1)",
};

/**
 * Inline style for hover transitions
 */
export const hoverStyle = {
  transition: "all 520ms cubic-bezier(0.22, 1, 0.36, 1)",
};

/**
 * Inline style for press transitions
 */
export const pressStyle = {
  transition: "transform 120ms cubic-bezier(0.16, 1, 0.3, 1)",
};

/**
 * Inline style for color transitions
 */
export const colorStyle = {
  transition: "color 280ms cubic-bezier(0.22, 1, 0.36, 1)",
};

/**
 * Common scroll reveal animation config
 */
export const revealAnimation = {
  initial: MOTION.variants.reveal.initial,
  whileInView: MOTION.variants.reveal.animate,
  viewport: MOTION.viewport,
  transition: {
    duration: MOTION.duration.scrollFade / 1000,
    ease: MOTION.easing.fluid,
  },
};

/**
 * Card enter animation config
 */
export const cardAnimation = {
  initial: MOTION.variants.card.initial,
  whileInView: MOTION.variants.card.animate,
  viewport: MOTION.viewport,
  transition: fluidTween,
};
