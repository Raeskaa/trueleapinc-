// Motion configuration and utilities
// Uses CSS custom properties for consistency with Tailwind

export const EASE_PREMIUM = 'cubic-bezier(0.22, 1, 0.36, 1)';

export const DURATIONS = {
  fast: 200,
  normal: 300,
  slow: 500,
  reveal: 1000,
} as const;

// Framer Motion variants (for when FM is loaded)
export const revealVariants = {
  hidden: { 
    opacity: 0, 
    y: 40 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 1,
      ease: [0.22, 1, 0.36, 1],
    }
  },
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const scaleOnHover = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.02,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    }
  },
};

// CSS-only reveal hook using Intersection Observer
export function useReveal(threshold = 0.1) {
  if (typeof window === 'undefined') return { ref: null };
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold }
  );

  return {
    observe: (el: Element | null) => {
      if (el) observer.observe(el);
    },
    disconnect: () => observer.disconnect(),
  };
}
