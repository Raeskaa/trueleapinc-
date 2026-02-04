import { useEffect, useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  duration?: number;
  start?: string;
  once?: boolean;
}

export function AnimatedSection({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  duration = 0.8,
  start = 'top 85%',
  once = true,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const element = ref.current;

    // Set initial state based on direction
    const initialState: gsap.TweenVars = { opacity: 0 };
    
    switch (direction) {
      case 'up':
        initialState.y = 40;
        break;
      case 'down':
        initialState.y = -40;
        break;
      case 'left':
        initialState.x = 40;
        break;
      case 'right':
        initialState.x = -40;
        break;
      case 'none':
        // Just opacity
        break;
    }

    gsap.set(element, initialState);

    const tween = gsap.to(element, {
      x: 0,
      y: 0,
      opacity: 1,
      duration,
      delay,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: element,
        start,
        once,
      },
    });

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === element) t.kill();
      });
    };
  }, [delay, direction, duration, start, once]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
