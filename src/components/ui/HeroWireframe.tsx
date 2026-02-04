import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface HeroWireframeProps {
  className?: string;
}

export function HeroWireframe({ className = '' }: HeroWireframeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wireframeRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const rafRef = useRef<number>();
  const currentPosition = useRef({ x: 0, y: 0 });

  // Check for reduced motion
  const prefersReducedMotion = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Smooth mouse tracking with lerp
  const updateParallax = useCallback(() => {
    if (!isHovering || prefersReducedMotion) return;

    const lerp = 0.08; // Slow, elegant interpolation
    currentPosition.current.x += (mousePosition.x - currentPosition.current.x) * lerp;
    currentPosition.current.y += (mousePosition.y - currentPosition.current.y) * lerp;

    rafRef.current = requestAnimationFrame(updateParallax);
  }, [mousePosition, isHovering, prefersReducedMotion]);

  // Handle mouse move
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || prefersReducedMotion) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Normalize to -1 to 1 range
    const x = (e.clientX - centerX) / (rect.width / 2);
    const y = (e.clientY - centerY) / (rect.height / 2);

    setMousePosition({ x, y });
  }, [prefersReducedMotion]);

  // Start/stop parallax animation loop
  useEffect(() => {
    if (isHovering && !prefersReducedMotion) {
      rafRef.current = requestAnimationFrame(updateParallax);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isHovering, updateParallax, prefersReducedMotion]);

  // GSAP entrance animations
  useEffect(() => {
    if (!wireframeRef.current || hasAnimated) return;

    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set('.wf-nav', { y: -30, opacity: 0 });
      gsap.set('.wf-sidebar', { x: -40, opacity: 0 });
      gsap.set('.wf-stat-card', { y: 40, opacity: 0 });
      gsap.set('.wf-chart-bar', { scaleY: 0, transformOrigin: 'bottom' });
      gsap.set('.wf-map-dot', { scale: 0, opacity: 0 });
      gsap.set('.wf-connection-line', { strokeDashoffset: 100 });
      gsap.set('.wf-bottom-card', { y: 50, opacity: 0 });
      gsap.set('.wf-chart-area', { opacity: 0 });
      gsap.set('.wf-map-area', { opacity: 0 });

      // Create timeline with scroll trigger
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
          once: true,
          onEnter: () => setHasAnimated(true),
        },
      });

      // Elegant, slow entrance animations
      tl.to('.wf-nav', { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' })
        .to('.wf-sidebar', { x: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=0.6')
        .to('.wf-stat-card', { 
          y: 0, 
          opacity: 1, 
          duration: 0.9, 
          stagger: 0.12, 
          ease: 'power2.out' 
        }, '-=0.5')
        .to('.wf-chart-area', { opacity: 1, duration: 0.5 }, '-=0.7')
        .to('.wf-map-area', { opacity: 1, duration: 0.5 }, '-=0.4')
        .to('.wf-chart-bar', { 
          scaleY: 1, 
          duration: 0.7, 
          stagger: 0.06, 
          ease: 'power2.out' 
        }, '-=0.3')
        .to('.wf-map-dot', { 
          scale: 1, 
          opacity: 1, 
          duration: 0.5, 
          stagger: 0.1, 
          ease: 'back.out(1.7)' 
        }, '-=0.5')
        .to('.wf-connection-line', { 
          strokeDashoffset: 0, 
          duration: 0.8, 
          stagger: 0.15, 
          ease: 'power1.inOut' 
        }, '-=0.3')
        .to('.wf-bottom-card', { 
          y: 0, 
          opacity: 1, 
          duration: 0.8, 
          stagger: 0.15, 
          ease: 'power2.out' 
        }, '-=0.6');

    }, wireframeRef);

    return () => ctx.revert();
  }, [hasAnimated]);

  // Calculate parallax transforms
  const getParallaxStyle = (depth: number) => {
    if (prefersReducedMotion) return {};
    const x = currentPosition.current.x * depth * 15;
    const y = currentPosition.current.y * depth * 10;
    return {
      transform: `translate3d(${x}px, ${y}px, 0)`,
    };
  };

  return (
    <div 
      ref={containerRef}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        currentPosition.current = { x: 0, y: 0 };
      }}
      style={{ perspective: '1200px' }}
    >
      <div 
        ref={wireframeRef}
        className="relative bg-paper border border-border rounded-2xl shadow-2xl overflow-hidden transition-transform duration-300"
        style={{ 
          transformStyle: 'preserve-3d',
          transform: `rotateX(${2 - currentPosition.current.y * 3}deg) rotateY(${currentPosition.current.x * 3}deg)`,
        }}
      >
        {/* Main SVG Wireframe */}
        <svg 
          className="w-full h-auto"
          viewBox="0 0 1200 700"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background */}
          <rect width="1200" height="700" className="fill-paper" />
          
          {/* Navigation Bar - Layer: Background */}
          <g className="wf-nav" style={getParallaxStyle(0.3)}>
            <rect x="0" y="0" width="1200" height="56" className="fill-cream" />
            <rect x="24" y="18" width="100" height="20" rx="4" className="fill-border" />
            <rect x="160" y="20" width="60" height="16" rx="3" className="fill-border/60" />
            <rect x="240" y="20" width="60" height="16" rx="3" className="fill-border/60" />
            <rect x="320" y="20" width="60" height="16" rx="3" className="fill-border/60" />
            <circle cx="1140" cy="28" r="14" className="fill-border/40" />
            <circle cx="1100" cy="28" r="14" className="fill-border/40" />
          </g>
          
          {/* Sidebar - Layer: Background */}
          <g className="wf-sidebar" style={getParallaxStyle(0.3)}>
            <rect x="0" y="56" width="220" height="644" className="fill-cream" />
            <rect x="20" y="80" width="180" height="36" rx="6" className="fill-primary/10" />
            <rect x="36" y="92" width="100" height="12" rx="2" className="fill-primary/30" />
            <rect x="36" y="144" width="80" height="10" rx="2" className="fill-border" />
            <rect x="36" y="184" width="90" height="10" rx="2" className="fill-border" />
            <rect x="36" y="224" width="70" height="10" rx="2" className="fill-border" />
            <rect x="20" y="280" width="180" height="1" className="fill-border" />
            <rect x="20" y="300" width="120" height="10" rx="2" className="fill-border/60" />
            <rect x="36" y="336" width="80" height="10" rx="2" className="fill-border" />
          </g>
          
          {/* Stat Cards - Layer: Foreground */}
          <g style={getParallaxStyle(1.2)}>
            {/* Card 1 */}
            <g className="wf-stat-card wf-interactive" data-card="1">
              <rect x="252" y="80" width="220" height="100" rx="10" className="fill-white transition-all duration-300 hover:fill-cream" 
                style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.06))' }} />
              <rect x="276" y="104" width="60" height="10" rx="2" className="fill-border/60" />
              <rect x="276" y="124" width="100" height="8" rx="2" className="fill-border/40" />
              <rect x="276" y="148" width="160" height="16" rx="4" className="fill-primary/25" />
            </g>
            
            {/* Card 2 */}
            <g className="wf-stat-card wf-interactive" data-card="2">
              <rect x="492" y="80" width="220" height="100" rx="10" className="fill-white transition-all duration-300 hover:fill-cream"
                style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.06))' }} />
              <rect x="516" y="104" width="60" height="10" rx="2" className="fill-border/60" />
              <rect x="516" y="124" width="100" height="8" rx="2" className="fill-border/40" />
              <rect x="516" y="148" width="160" height="16" rx="4" className="fill-violet/25" />
            </g>
            
            {/* Card 3 */}
            <g className="wf-stat-card wf-interactive" data-card="3">
              <rect x="732" y="80" width="220" height="100" rx="10" className="fill-white transition-all duration-300 hover:fill-cream"
                style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.06))' }} />
              <rect x="756" y="104" width="60" height="10" rx="2" className="fill-border/60" />
              <rect x="756" y="124" width="100" height="8" rx="2" className="fill-border/40" />
              <rect x="756" y="148" width="160" height="16" rx="4" className="fill-primary/15" />
            </g>
            
            {/* Card 4 */}
            <g className="wf-stat-card wf-interactive" data-card="4">
              <rect x="972" y="80" width="200" height="100" rx="10" className="fill-white transition-all duration-300 hover:fill-cream"
                style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.06))' }} />
              <rect x="996" y="104" width="60" height="10" rx="2" className="fill-border/60" />
              <rect x="996" y="124" width="100" height="8" rx="2" className="fill-border/40" />
              <rect x="996" y="148" width="140" height="16" rx="4" className="fill-border/30" />
            </g>
          </g>
          
          {/* Chart Area - Layer: Middle */}
          <g className="wf-chart-area" style={getParallaxStyle(0.7)}>
            <rect x="252" y="204" width="460" height="280" rx="10" className="fill-white"
              style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.04))' }} />
            <rect x="276" y="228" width="120" height="14" rx="3" className="fill-border" />
            <rect x="276" y="250" width="80" height="10" rx="2" className="fill-border/50" />
            
            {/* Chart Grid Lines */}
            <line x1="300" y1="290" x2="680" y2="290" className="stroke-border/30" strokeWidth="1" />
            <line x1="300" y1="340" x2="680" y2="340" className="stroke-border/30" strokeWidth="1" />
            <line x1="300" y1="390" x2="680" y2="390" className="stroke-border/30" strokeWidth="1" />
            
            {/* Chart Bars with hover effect */}
            <rect x="320" y="420" width="36" height="40" rx="4" className="wf-chart-bar fill-primary/30 transition-all duration-300 hover:fill-primary/50" />
            <rect x="380" y="380" width="36" height="80" rx="4" className="wf-chart-bar fill-primary/40 transition-all duration-300 hover:fill-primary/60" />
            <rect x="440" y="330" width="36" height="130" rx="4" className="wf-chart-bar fill-primary/50 transition-all duration-300 hover:fill-primary/70" />
            <rect x="500" y="360" width="36" height="100" rx="4" className="wf-chart-bar fill-primary/40 transition-all duration-300 hover:fill-primary/60" />
            <rect x="560" y="300" width="36" height="160" rx="4" className="wf-chart-bar fill-primary/60 transition-all duration-300 hover:fill-primary/80" />
            <rect x="620" y="340" width="36" height="120" rx="4" className="wf-chart-bar fill-primary/45 transition-all duration-300 hover:fill-primary/65" />
          </g>
          
          {/* Map Area - Layer: Middle */}
          <g className="wf-map-area" style={getParallaxStyle(0.7)}>
            <rect x="732" y="204" width="440" height="280" rx="10" className="fill-white"
              style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.04))' }} />
            <rect x="756" y="228" width="100" height="14" rx="3" className="fill-border" />
            
            {/* Connection Lines - draw in animation */}
            <line x1="860" y1="340" x2="930" y2="380" className="wf-connection-line stroke-primary/30" strokeWidth="2" strokeDasharray="100" />
            <line x1="930" y1="380" x2="1000" y2="330" className="wf-connection-line stroke-primary/30" strokeWidth="2" strokeDasharray="100" />
            <line x1="1000" y1="330" x2="1060" y2="370" className="wf-connection-line stroke-primary/30" strokeWidth="2" strokeDasharray="100" />
            <line x1="1060" y1="370" x2="1100" y2="400" className="wf-connection-line stroke-primary/30" strokeWidth="2" strokeDasharray="100" />
            
            {/* Map Dots - scale in with pulse */}
            <circle cx="860" cy="340" r="10" className="wf-map-dot fill-primary/70 transition-all duration-300 hover:fill-primary" />
            <circle cx="930" cy="380" r="14" className="wf-map-dot fill-primary/80 transition-all duration-300 hover:fill-primary" />
            <circle cx="1000" cy="330" r="8" className="wf-map-dot fill-violet/60 transition-all duration-300 hover:fill-violet" />
            <circle cx="1060" cy="370" r="12" className="wf-map-dot fill-primary/70 transition-all duration-300 hover:fill-primary" />
            <circle cx="1100" cy="400" r="9" className="wf-map-dot fill-violet/50 transition-all duration-300 hover:fill-violet" />
            <circle cx="890" cy="420" r="6" className="wf-map-dot fill-primary/40" />
            <circle cx="1020" cy="440" r="7" className="wf-map-dot fill-violet/40" />
          </g>
          
          {/* Bottom Cards - Layer: Foreground */}
          <g style={getParallaxStyle(1.0)}>
            {/* Bottom Card 1 */}
            <g className="wf-bottom-card wf-interactive">
              <rect x="252" y="508" width="300" height="160" rx="10" className="fill-white transition-all duration-300 hover:fill-cream"
                style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.06))' }} />
              <rect x="276" y="532" width="140" height="14" rx="3" className="fill-border" />
              <rect x="276" y="558" width="250" height="8" rx="2" className="fill-border/50" />
              <rect x="276" y="576" width="220" height="8" rx="2" className="fill-border/40" />
              <rect x="276" y="594" width="180" height="8" rx="2" className="fill-border/30" />
              <rect x="276" y="628" width="100" height="24" rx="6" className="fill-primary/20" />
            </g>
            
            {/* Bottom Card 2 */}
            <g className="wf-bottom-card wf-interactive">
              <rect x="572" y="508" width="300" height="160" rx="10" className="fill-white transition-all duration-300 hover:fill-cream"
                style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.06))' }} />
              <rect x="596" y="532" width="140" height="14" rx="3" className="fill-border" />
              <rect x="596" y="558" width="250" height="8" rx="2" className="fill-border/50" />
              <rect x="596" y="576" width="200" height="8" rx="2" className="fill-border/40" />
              <rect x="596" y="594" width="160" height="8" rx="2" className="fill-border/30" />
              <rect x="596" y="628" width="100" height="24" rx="6" className="fill-violet/20" />
            </g>
            
            {/* Bottom Card 3 */}
            <g className="wf-bottom-card wf-interactive">
              <rect x="892" y="508" width="280" height="160" rx="10" className="fill-white transition-all duration-300 hover:fill-cream"
                style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.06))' }} />
              <rect x="916" y="532" width="120" height="14" rx="3" className="fill-border" />
              <rect x="916" y="558" width="230" height="8" rx="2" className="fill-border/50" />
              <rect x="916" y="576" width="180" height="8" rx="2" className="fill-border/40" />
              <rect x="916" y="594" width="140" height="8" rx="2" className="fill-border/30" />
              <rect x="916" y="628" width="100" height="24" rx="6" className="fill-primary/15" />
            </g>
          </g>
        </svg>
        
        {/* Subtle overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-cream/30 via-transparent to-transparent pointer-events-none" />
        
        {/* Hover glow effect */}
        <div 
          className="absolute inset-0 pointer-events-none transition-opacity duration-500 rounded-2xl"
          style={{
            opacity: isHovering ? 0.5 : 0,
            background: `radial-gradient(circle at ${50 + mousePosition.x * 30}% ${50 + mousePosition.y * 30}%, rgba(87, 39, 143, 0.08) 0%, transparent 50%)`,
          }}
        />
      </div>
      
      {/* Decorative blur elements */}
      <div 
        className="absolute -bottom-8 -left-8 w-40 h-40 bg-primary/5 rounded-full blur-3xl transition-transform duration-700"
        style={{ transform: `translate(${currentPosition.current.x * -10}px, ${currentPosition.current.y * -10}px)` }}
      />
      <div 
        className="absolute -top-8 -right-8 w-48 h-48 bg-violet/5 rounded-full blur-3xl transition-transform duration-700"
        style={{ transform: `translate(${currentPosition.current.x * 10}px, ${currentPosition.current.y * 10}px)` }}
      />
      
      {/* Interactive cursor style */}
      <style>{`
        .wf-interactive {
          cursor: pointer;
        }
        .wf-interactive:hover rect:first-child {
          filter: drop-shadow(0 4px 16px rgba(0,0,0,0.1)) !important;
        }
      `}</style>
    </div>
  );
}
