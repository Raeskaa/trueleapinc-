import { useEffect, useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ParallaxImageProps {
  children?: ReactNode;
  className?: string;
  speed?: number; // -1 to 1, negative = opposite direction
  scale?: boolean; // Also scale slightly on scroll
  src?: string;
  alt?: string;
  aspect?: '16:9' | '4:3' | '1:1' | '21:9' | '3:4';
}

const aspectClasses = {
  '16:9': 'aspect-video',
  '4:3': 'aspect-[4/3]',
  '1:1': 'aspect-square',
  '21:9': 'aspect-[21/9]',
  '3:4': 'aspect-[3/4]',
};

export function ParallaxImage({
  children,
  className = '',
  speed = 0.2,
  scale = false,
  src,
  alt = '',
  aspect = '16:9',
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !innerRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const inner = innerRef.current;

    const tween = gsap.to(inner, {
      yPercent: speed * 30,
      scale: scale ? 1 + Math.abs(speed) * 0.1 : 1,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === containerRef.current) t.kill();
      });
    };
  }, [speed, scale]);

  return (
    <div 
      ref={containerRef} 
      className={`overflow-hidden ${aspectClasses[aspect]} ${className}`}
    >
      <div 
        ref={innerRef} 
        className="w-full h-full"
        style={{ willChange: 'transform' }}
      >
        {src ? (
          <img 
            src={src} 
            alt={alt} 
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : children}
      </div>
    </div>
  );
}
