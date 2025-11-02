/**
 * Animation Utilities and Reusable Variants
 * 
 * This module provides consistent animation configurations throughout the app
 * using Framer Motion. All animations respect user's reduced motion preferences.
 */

import { Variants, Transition } from "framer-motion"

// ============================================================================
// TRANSITIONS
// ============================================================================

export const transitions = {
  // Spring animations for natural feel
  spring: {
    type: "spring",
    stiffness: 300,
    damping: 30,
  } as Transition,
  
  springBouncy: {
    type: "spring",
    stiffness: 400,
    damping: 20,
  } as Transition,
  
  springGentle: {
    type: "spring",
    stiffness: 200,
    damping: 25,
  } as Transition,

  // Smooth easing
  smooth: {
    type: "tween",
    duration: 0.3,
    ease: "easeInOut",
  } as Transition,

  smoothFast: {
    type: "tween",
    duration: 0.2,
    ease: "easeInOut",
  } as Transition,

  smoothSlow: {
    type: "tween",
    duration: 0.5,
    ease: "easeInOut",
  } as Transition,
}

// ============================================================================
// VARIANTS
// ============================================================================

// Fade animations
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: transitions.smooth,
  },
}

export const fadeInUp: Variants = {
  hidden: { 
    opacity: 0,
    y: 20,
  },
  visible: { 
    opacity: 1,
    y: 0,
    transition: transitions.smooth,
  },
}

export const fadeInDown: Variants = {
  hidden: { 
    opacity: 0,
    y: -20,
  },
  visible: { 
    opacity: 1,
    y: 0,
    transition: transitions.smooth,
  },
}

export const fadeInLeft: Variants = {
  hidden: { 
    opacity: 0,
    x: -20,
  },
  visible: { 
    opacity: 1,
    x: 0,
    transition: transitions.smooth,
  },
}

export const fadeInRight: Variants = {
  hidden: { 
    opacity: 0,
    x: 20,
  },
  visible: { 
    opacity: 1,
    x: 0,
    transition: transitions.smooth,
  },
}

// Scale animations
export const scaleIn: Variants = {
  hidden: { 
    opacity: 0,
    scale: 0.8,
  },
  visible: { 
    opacity: 1,
    scale: 1,
    transition: transitions.springGentle,
  },
}

export const scaleInBounce: Variants = {
  hidden: { 
    opacity: 0,
    scale: 0.5,
  },
  visible: { 
    opacity: 1,
    scale: 1,
    transition: transitions.springBouncy,
  },
}

// Button interactions
export const buttonHover: Variants = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: transitions.smoothFast,
  },
  tap: { 
    scale: 0.95,
    transition: transitions.smoothFast,
  },
}

export const buttonHoverSubtle: Variants = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.02,
    transition: transitions.smoothFast,
  },
  tap: { 
    scale: 0.98,
    transition: transitions.smoothFast,
  },
}

// Stagger children
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.smooth,
  },
}

// Slide animations
export const slideInLeft: Variants = {
  hidden: { 
    x: "-100%",
    opacity: 0,
  },
  visible: { 
    x: 0,
    opacity: 1,
    transition: transitions.smooth,
  },
  exit: { 
    x: "-100%",
    opacity: 0,
    transition: transitions.smooth,
  },
}

export const slideInRight: Variants = {
  hidden: { 
    x: "100%",
    opacity: 0,
  },
  visible: { 
    x: 0,
    opacity: 1,
    transition: transitions.smooth,
  },
  exit: { 
    x: "100%",
    opacity: 0,
    transition: transitions.smooth,
  },
}

// Card animations
export const cardHover: Variants = {
  rest: { 
    scale: 1,
    boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
  },
  hover: { 
    scale: 1.02,
    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
    transition: transitions.smoothFast,
  },
}

// Pulse animation for loading states
export const pulse: Variants = {
  initial: { opacity: 1 },
  animate: {
    opacity: [1, 0.5, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
}

// Shimmer effect for skeletons
export const shimmer: Variants = {
  initial: { backgroundPosition: "-200% 0" },
  animate: {
    backgroundPosition: "200% 0",
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "linear",
    },
  },
}

// Success checkmark animation
export const checkmark: Variants = {
  hidden: { 
    pathLength: 0,
    opacity: 0,
  },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { type: "spring", duration: 0.6, bounce: 0 },
      opacity: { duration: 0.01 },
    },
  },
}

// Modal/Dialog animations
export const modalOverlay: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.2 },
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2 },
  },
}

export const modalContent: Variants = {
  hidden: { 
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
  visible: { 
    opacity: 1,
    scale: 1,
    y: 0,
    transition: transitions.spring,
  },
  exit: { 
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: { duration: 0.2 },
  },
}

// Floating animation for decorative elements
export const float: Variants = {
  initial: { y: 0 },
  animate: {
    y: [-5, 5, -5],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
}

// Rotate animation
export const rotate: Variants = {
  initial: { rotate: 0 },
  animate: {
    rotate: 360,
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "linear",
    },
  },
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === "undefined") return false
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

/**
 * Get animation variant respecting user preferences
 */
export const getAnimationVariant = (variant: Variants): Variants => {
  if (prefersReducedMotion()) {
    // Return simplified version for reduced motion
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.01 } },
    }
  }
  return variant
}

/**
 * Page transition configuration
 */
export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: transitions.smooth,
}

