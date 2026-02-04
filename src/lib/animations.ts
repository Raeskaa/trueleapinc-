import { useEffect, useRef, type RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Hook for basic scroll-triggered reveal animations
 */
export function useScrollReveal<T extends HTMLElement>(
  options?: {
    y?: number;
    opacity?: number;
    duration?: number;
    delay?: number;
    start?: string;
    markers?: boolean;
  }
): RefObject<T | null> {
  const ref = useRef<T>(null);
  
  const {
    y = 40,
    opacity = 0,
    duration = 1,
    delay = 0,
    start = 'top 85%',
    markers = false,
  } = options || {};
  
  useEffect(() => {
    if (!ref.current) return;
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    
    const element = ref.current;
    
    gsap.set(element, { y, opacity });
    
    const tween = gsap.to(element, {
      y: 0,
      opacity: 1,
      duration,
      delay,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: element,
        start,
        markers,
      },
    });
    
    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === element) t.kill();
      });
    };
  }, [y, opacity, duration, delay, start, markers]);
  
  return ref;
}

/**
 * Hook for staggered children reveal
 */
export function useScrollStagger<T extends HTMLElement>(
  selector: string,
  options?: {
    y?: number;
    stagger?: number;
    duration?: number;
    start?: string;
  }
): RefObject<T | null> {
  const ref = useRef<T>(null);
  
  const {
    y = 30,
    stagger = 0.1,
    duration = 0.8,
    start = 'top 80%',
  } = options || {};
  
  useEffect(() => {
    if (!ref.current) return;
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    
    const container = ref.current;
    const children = container.querySelectorAll(selector);
    
    if (children.length === 0) return;
    
    gsap.set(children, { y, opacity: 0 });
    
    const tween = gsap.to(children, {
      y: 0,
      opacity: 1,
      duration,
      stagger,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: container,
        start,
      },
    });
    
    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === container) t.kill();
      });
    };
  }, [selector, y, stagger, duration, start]);
  
  return ref;
}

/**
 * Hook for parallax scrolling effect
 */
export function useParallax<T extends HTMLElement>(
  speed: number = 0.5
): RefObject<T | null> {
  const ref = useRef<T>(null);
  
  useEffect(() => {
    if (!ref.current) return;
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    
    const element = ref.current;
    
    const tween = gsap.to(element, {
      yPercent: speed * 100,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
    
    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === element) t.kill();
      });
    };
  }, [speed]);
  
  return ref;
}

/**
 * Hook for horizontal scroll sections
 */
export function useHorizontalScroll<T extends HTMLElement>(
  options?: {
    ease?: string;
    pinSpacing?: boolean;
  }
): RefObject<T | null> {
  const ref = useRef<T>(null);
  
  const { ease = 'none', pinSpacing = true } = options || {};
  
  useEffect(() => {
    if (!ref.current) return;
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    
    const container = ref.current;
    const sections = container.querySelectorAll(':scope > *');
    
    const totalWidth = Array.from(sections).reduce((acc, section) => {
      return acc + (section as HTMLElement).offsetWidth;
    }, 0);
    
    const tween = gsap.to(sections, {
      xPercent: -100 * (sections.length - 1),
      ease,
      scrollTrigger: {
        trigger: container,
        pin: true,
        pinSpacing,
        scrub: 1,
        end: () => `+=${totalWidth}`,
      },
    });
    
    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === container) t.kill();
      });
    };
  }, [ease, pinSpacing]);
  
  return ref;
}

/**
 * Hook for text split and reveal animation
 */
export function useTextReveal<T extends HTMLElement>(
  options?: {
    type?: 'words' | 'chars' | 'lines';
    stagger?: number;
    duration?: number;
    start?: string;
  }
): RefObject<T | null> {
  const ref = useRef<T>(null);
  
  const {
    type = 'words',
    stagger = 0.03,
    duration = 0.8,
    start = 'top 80%',
  } = options || {};
  
  useEffect(() => {
    if (!ref.current) return;
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    
    const element = ref.current;
    const text = element.innerText;
    
    let items: string[];
    if (type === 'chars') {
      items = text.split('');
    } else if (type === 'words') {
      items = text.split(/\s+/);
    } else {
      items = text.split('\n');
    }
    
    // Wrap each item in a span
    element.innerHTML = items
      .map((item, i) => {
        const space = type === 'words' && i < items.length - 1 ? '&nbsp;' : '';
        return `<span class="inline-block" style="opacity: 0; transform: translateY(20px)">${item}${space}</span>`;
      })
      .join(type === 'lines' ? '<br>' : '');
    
    const spans = element.querySelectorAll('span');
    
    const tween = gsap.to(spans, {
      y: 0,
      opacity: 1,
      duration,
      stagger,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: element,
        start,
      },
    });
    
    return () => {
      tween.kill();
      element.innerText = text;
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === element) t.kill();
      });
    };
  }, [type, stagger, duration, start]);
  
  return ref;
}

/**
 * Hook for scale-based reveal (good for images/cards)
 */
export function useScaleReveal<T extends HTMLElement>(
  options?: {
    scale?: number;
    duration?: number;
    start?: string;
  }
): RefObject<T | null> {
  const ref = useRef<T>(null);
  
  const {
    scale = 0.9,
    duration = 1.2,
    start = 'top 85%',
  } = options || {};
  
  useEffect(() => {
    if (!ref.current) return;
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    
    const element = ref.current;
    
    gsap.set(element, { scale, opacity: 0 });
    
    const tween = gsap.to(element, {
      scale: 1,
      opacity: 1,
      duration,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: element,
        start,
      },
    });
    
    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === element) t.kill();
      });
    };
  }, [scale, duration, start]);
  
  return ref;
}

/**
 * Initialize GSAP defaults (call once in app)
 */
export function initGSAP() {
  if (typeof window === 'undefined') return;
  
  gsap.registerPlugin(ScrollTrigger);
  
  // Set global defaults
  gsap.defaults({
    ease: 'expo.out',
    duration: 1,
  });
  
  // Refresh on window resize (debounced)
  let resizeTimer: ReturnType<typeof setTimeout>;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);
  });
}
