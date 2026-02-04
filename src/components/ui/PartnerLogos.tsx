import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface Partner {
  name: string;
  logo: React.ReactNode;
}

// Minimalist tech partner logos - larger, cleaner
const partners: Partner[] = [
  {
    name: 'Amazon Web Services',
    logo: (
      <svg viewBox="0 0 80 32" fill="currentColor" className="h-8 md:h-10 w-auto">
        <path d="M25.5 16.8c-2.3 1.7-5.6 2.6-8.5 2.6-4 0-7.6-1.5-10.3-4-.2-.2 0-.5.3-.3 2.9 1.7 6.6 2.7 10.3 2.7 2.5 0 5.3-.5 7.9-1.6.4-.2.7.3.3.6z"/>
        <path d="M26.5 15.5c-.3-.4-2-.2-2.7-.1-.2 0-.3-.2-.1-.3 1.3-1 3.5-.7 3.8-.4.3.3-.1 2.5-1.3 3.6-.2.2-.4.1-.3-.1.3-.7.9-2.3.6-2.7z"/>
        <text x="32" y="20" fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="11" letterSpacing="-0.5">AWS</text>
      </svg>
    ),
  },
  {
    name: 'Google Cloud',
    logo: (
      <svg viewBox="0 0 120 32" fill="currentColor" className="h-8 md:h-10 w-auto">
        <path d="M18 8l-1.6 0-3.3 5.3 3.5 5.3H18l-3.3-5.3z"/>
        <path d="M11.3 8h1.6l3.3 5.3-3.5 5.3h-1.4l3.3-5.3z"/>
        <circle cx="14.7" cy="13.3" r="2"/>
        <text x="26" y="19" fontFamily="system-ui, sans-serif" fontWeight="500" fontSize="11">Google Cloud</text>
      </svg>
    ),
  },
  {
    name: 'Microsoft',
    logo: (
      <svg viewBox="0 0 100 32" fill="currentColor" className="h-8 md:h-10 w-auto">
        <rect x="6" y="6" width="8" height="8"/>
        <rect x="16" y="6" width="8" height="8"/>
        <rect x="6" y="16" width="8" height="8"/>
        <rect x="16" y="16" width="8" height="8"/>
        <text x="30" y="19" fontFamily="system-ui, sans-serif" fontWeight="600" fontSize="11">Microsoft</text>
      </svg>
    ),
  },
  {
    name: 'Cisco',
    logo: (
      <svg viewBox="0 0 70 32" fill="currentColor" className="h-8 md:h-10 w-auto">
        <rect x="6" y="11" width="2.5" height="6" rx="1"/>
        <rect x="10" y="8" width="2.5" height="12" rx="1"/>
        <rect x="14" y="5" width="2.5" height="18" rx="1"/>
        <rect x="18" y="8" width="2.5" height="12" rx="1"/>
        <rect x="22" y="11" width="2.5" height="6" rx="1"/>
        <text x="28" y="19" fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="11">cisco</text>
      </svg>
    ),
  },
  {
    name: 'Intel',
    logo: (
      <svg viewBox="0 0 50 32" fill="currentColor" className="h-8 md:h-10 w-auto">
        <text x="6" y="21" fontFamily="system-ui, sans-serif" fontWeight="500" fontSize="14" fontStyle="italic">intel</text>
        <circle cx="42" cy="10" r="2.5"/>
      </svg>
    ),
  },
  {
    name: 'Qualcomm',
    logo: (
      <svg viewBox="0 0 100 32" fill="currentColor" className="h-8 md:h-10 w-auto">
        <circle cx="14" cy="16" r="8" fill="none" stroke="currentColor" strokeWidth="2"/>
        <path d="M10 16l3 3 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <text x="26" y="20" fontFamily="system-ui, sans-serif" fontWeight="500" fontSize="11">Qualcomm</text>
      </svg>
    ),
  },
];

interface PartnerLogosProps {
  className?: string;
  title?: string;
}

export function PartnerLogos({ className = '', title = 'Trusted by industry leaders' }: PartnerLogosProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    
    const logos = containerRef.current.querySelectorAll('.partner-logo');
    
    gsap.fromTo(logos, 
      { opacity: 0, y: 10 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out',
        delay: 0.8,
      }
    );
  }, []);

  return (
    <div ref={containerRef} className={`${className}`}>
      {title && (
        <p className="text-xs text-muted tracking-wide uppercase mb-8 text-center">
          {title}
        </p>
      )}
      <div className="flex flex-wrap items-center justify-center gap-x-12 md:gap-x-16 gap-y-6">
        {partners.map((partner) => (
          <div 
            key={partner.name} 
            className="partner-logo flex items-center justify-center text-ink/40 hover:text-ink/70 transition-colors duration-300"
            title={partner.name}
          >
            {partner.logo}
          </div>
        ))}
      </div>
    </div>
  );
}
