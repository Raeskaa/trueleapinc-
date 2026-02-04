import { useEffect, useRef, type ElementType } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface AnimatedHeadlineProps {
  children: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  className?: string;
  splitBy?: 'words' | 'chars';
  stagger?: number;
  duration?: number;
  start?: string;
  delay?: number;
}

export function AnimatedHeadline({
  children,
  as: Tag = 'h1',
  className = '',
  splitBy = 'words',
  stagger = 0.04,
  duration = 0.8,
  start = 'top 85%',
  delay = 0,
}: AnimatedHeadlineProps) {
  const ref = useRef<HTMLElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!ref.current || hasAnimated.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const element = ref.current;
    const text = children;

    // Split text
    let items: string[];
    if (splitBy === 'chars') {
      items = text.split('');
    } else {
      items = text.split(/(\s+)/); // Keep whitespace as separate items
    }

    // Wrap each item in a span
    element.innerHTML = items
      .map((item) => {
        if (item.match(/^\s+$/)) {
          // Whitespace - preserve it
          return item;
        }
        return `<span class="inline-block" style="opacity: 0; transform: translateY(20px)">${item}</span>`;
      })
      .join('');

    const spans = element.querySelectorAll('span');

    const tween = gsap.to(spans, {
      y: 0,
      opacity: 1,
      duration,
      delay,
      stagger,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: element,
        start,
        once: true,
      },
      onComplete: () => {
        hasAnimated.current = true;
      },
    });

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === element) t.kill();
      });
    };
  }, [children, splitBy, stagger, duration, start, delay]);

  return (
    <Tag ref={ref as any} className={className}>
      {children}
    </Tag>
  );
}
