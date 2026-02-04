import { useEffect, useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface StaggerGridProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
  duration?: number;
  start?: string;
  direction?: 'up' | 'left' | 'scale';
}

export function StaggerGrid({
  children,
  className = '',
  stagger = 0.1,
  duration = 0.6,
  start = 'top 80%',
  direction = 'up',
}: StaggerGridProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const container = ref.current;
    const children = container.children;

    if (children.length === 0) return;

    // Set initial state
    const initialState: gsap.TweenVars = { opacity: 0 };
    
    switch (direction) {
      case 'up':
        initialState.y = 30;
        break;
      case 'left':
        initialState.x = 30;
        break;
      case 'scale':
        initialState.scale = 0.95;
        break;
    }

    gsap.set(children, initialState);

    const tween = gsap.to(children, {
      x: 0,
      y: 0,
      scale: 1,
      opacity: 1,
      duration,
      stagger,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: container,
        start,
        once: true,
      },
    });

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === container) t.kill();
      });
    };
  }, [stagger, duration, start, direction]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
