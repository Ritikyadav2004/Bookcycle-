// Framer Motion animation variants for BookCycle

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

export const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export const fadeInDown = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export const fadeInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export const fadeInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

export const slideUp = {
  hidden: { y: '100%' },
  visible: { y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  exit: { y: '100%', transition: { duration: 0.3, ease: 'easeIn' } },
};

export const slideDown = {
  hidden: { y: '-100%', opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { y: '-100%', opacity: 0, transition: { duration: 0.3 } },
};

export const slideLeft = {
  hidden: { x: '100%' },
  visible: { x: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  exit: { x: '100%', transition: { duration: 0.3, ease: 'easeIn' } },
};

export const slideRight = {
  hidden: { x: '-100%' },
  visible: { x: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  exit: { x: '-100%', transition: { duration: 0.3, ease: 'easeIn' } },
};

// Stagger container
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerFast = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

// Child variants for stagger
export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

// Modal overlay
export const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

// Modal content
export const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: {
    opacity: 1, scale: 1, y: 0,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0, scale: 0.95, y: 10,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

// Page transition
export const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.25, ease: 'easeIn' } },
};

// Card hover
export const cardHover = {
  rest: { y: 0, boxShadow: '0 2px 8px rgba(22, 61, 42, 0.08)' },
  hover: {
    y: -6,
    boxShadow: '0 12px 32px rgba(22, 61, 42, 0.15)',
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

// Button tap
export const buttonTap = {
  tap: { scale: 0.97 },
};

// Word reveal
export const wordRevealContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.3,
    },
  },
};

export const wordRevealChild = {
  hidden: { opacity: 0, y: 40, rotateX: -40 },
  visible: {
    opacity: 1, y: 0, rotateX: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

// Counter
export const counterVariant = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1, scale: 1,
    transition: { duration: 0.5, type: 'spring', stiffness: 100, damping: 12 },
  },
};

// Accordion
export const accordionContent = {
  hidden: { height: 0, opacity: 0 },
  visible: {
    height: 'auto', opacity: 1,
    transition: { height: { duration: 0.3, ease: 'easeOut' }, opacity: { duration: 0.25, delay: 0.05 } },
  },
  exit: {
    height: 0, opacity: 0,
    transition: { height: { duration: 0.25, ease: 'easeIn' }, opacity: { duration: 0.15 } },
  },
};

// Toast
export const toastVariants = {
  initial: { opacity: 0, y: 50, scale: 0.9 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 20, scale: 0.9 },
};

// Floating book animation
export const floatingBook = (delay = 0) => ({
  y: [0, -15, 0],
  rotate: [0, 3, 0],
  transition: {
    duration: 5 + delay,
    repeat: Infinity,
    ease: 'easeInOut',
    delay: delay,
  },
});

// Progress bar
export const progressBar = {
  hidden: { width: 0 },
  visible: (width) => ({
    width: `${width}%`,
    transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 },
  }),
};
