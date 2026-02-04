import { useEffect, useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface HorizontalScrollProps {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  speed?: number; // Multiplier for scroll distance
  start?: string; // ScrollTrigger start position
}

export function HorizontalScroll({
  children,
  className = '',
  containerClassName = '',
  speed = 1,
  start = 'top center', // Pin when top of container hits center of viewport
}: HorizontalScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !trackRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const container = containerRef.current;
    const track = trackRef.current;

    // Calculate how far to scroll (accounting for container width)
    const scrollWidth = track.scrollWidth - container.offsetWidth;

    // Set initial position
    gsap.set(track, { x: 0 });

    const tween = gsap.to(track, {
      x: -scrollWidth,
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        start: start,
        end: () => `+=${scrollWidth * speed}`,
        pin: true,
        scrub: 0.5,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        pinSpacing: true,
      },
    });

    // Refresh ScrollTrigger after fonts/images load
    const handleLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', handleLoad);

    return () => {
      window.removeEventListener('load', handleLoad);
      tween.kill();
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === container) t.kill();
      });
    };
  }, [speed, start]);

  return (
    <div ref={containerRef} className={`overflow-hidden ${containerClassName}`}>
      <div 
        ref={trackRef} 
        className={`flex items-center ${className}`}
        style={{ 
          willChange: 'transform',
          paddingLeft: 'max(1.5rem, calc((100vw - 80rem) / 2 + 1.5rem))',
          paddingRight: '20vw',
        }}
      >
        {children}
      </div>
    </div>
  );
}

// Individual slide component for use within HorizontalScroll
interface HorizontalSlideProps {
  children: ReactNode;
  className?: string;
  width?: string; // e.g., '80vw', '600px'
}

export function HorizontalSlide({
  children,
  className = '',
  width = '80vw',
}: HorizontalSlideProps) {
  return (
    <div 
      className={`flex-shrink-0 ${className}`}
      style={{ width }}
    >
      {children}
    </div>
  );
}
