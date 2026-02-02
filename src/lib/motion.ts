import type { Variants, Transition } from 'motion/react'

// Spring transitions - smooth & measured personality
export const springSubtle: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 30,
}

export const springSnappy: Transition = {
  type: 'spring',
  stiffness: 500,
  damping: 25,
}

// Duration constants
export const durationStandard = 0.3 // 250-350ms range
export const durationSlow = 0.5 // typewriter completion

// Fade up animation - common page element entrance
export const fadeUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durationStandard,
      ease: 'easeOut',
    },
  },
}

// Stagger container - orchestrates children animation timing
export const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

// Card hover - subtle lift effect
export const cardHoverVariants: Variants = {
  rest: {
    y: 0,
  },
  hover: {
    y: -4,
    transition: springSubtle,
  },
}

// Button tap - tactile press feedback
export const buttonTapVariants: Variants = {
  rest: {
    scale: 1,
  },
  tap: {
    scale: 0.97,
    transition: springSnappy,
  },
}
