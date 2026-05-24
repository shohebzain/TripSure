
/**
 * Animation Design Tokens for TripSure
 * Standardizing durations, easings, and patterns for a consistent UI feel.
 */

export const TRANSITIONS = {
  fast: 0.2,
  standard: 0.4,
  emphasis: 0.6,
  // Fix: Cast easing to any to avoid type mismatch in framer-motion props
  easing: [0.16, 1, 0.3, 1] as any, // Custom Exponential Out
  spring: {
    type: "spring",
    stiffness: 300,
    damping: 30
  }
};

export const VARIANTS = {
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: TRANSITIONS.standard, ease: TRANSITIONS.easing }
  },
  
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  },

  scaleHover: {
    hover: { scale: 1.02, transition: { duration: TRANSITIONS.fast } },
    tap: { scale: 0.98 }
  },

  pageTransition: {
    initial: { opacity: 0, x: 10 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -10 },
    transition: { duration: TRANSITIONS.standard, ease: TRANSITIONS.easing }
  }
};
