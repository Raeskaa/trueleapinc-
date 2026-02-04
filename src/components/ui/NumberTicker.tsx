import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface NumberTickerProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  start?: string;
  className?: string;
  format?: 'number' | 'compact' | 'decimal';
  decimals?: number;
}

export function NumberTicker({
  value,
  suffix = '',
  prefix = '',
  duration = 1.5,
  start = 'top 80%',
  className = '',
  format = 'number',
  decimals = 0,
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayValue, setDisplayValue] = useState('0');
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!ref.current || hasAnimated.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      setDisplayValue(formatNumber(value, format, decimals));
      return;
    }

    const element = ref.current;
    const obj = { val: 0 };

    const tween = gsap.to(obj, {
      val: value,
      duration,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: element,
        start,
        once: true,
      },
      onUpdate: () => {
        setDisplayValue(formatNumber(obj.val, format, decimals));
      },
      onComplete: () => {
        hasAnimated.current = true;
        setDisplayValue(formatNumber(value, format, decimals));
      },
    });

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === element) t.kill();
      });
    };
  }, [value, duration, start, format, decimals]);

  return (
    <span ref={ref} className={className}>
      {prefix}{displayValue}{suffix}
    </span>
  );
}

function formatNumber(num: number, format: 'number' | 'compact' | 'decimal', decimals: number): string {
  switch (format) {
    case 'compact':
      if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
      }
      if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
      }
      return Math.round(num).toString();
    
    case 'decimal':
      return num.toFixed(decimals);
    
    case 'number':
    default:
      return Math.round(num).toLocaleString();
  }
}

// Simple non-animated version for server rendering
export function StaticNumber({
  value,
  suffix = '',
  prefix = '',
  className = '',
  format = 'number',
  decimals = 0,
}: Omit<NumberTickerProps, 'duration' | 'start'>) {
  return (
    <span className={className}>
      {prefix}{formatNumber(value, format, decimals)}{suffix}
    </span>
  );
}
