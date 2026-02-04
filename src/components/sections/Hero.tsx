import type { ReactNode } from 'react';
import { WaveTransition } from '../ui/WaveTransition';
import { Button } from '../ui/Button';

interface HeroProps {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
  showWave?: boolean;
}

export function Hero({
  eyebrow,
  title,
  subtitle,
  ctaText,
  ctaHref,
  showWave = true,
}: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background mesh */}
      <div className="absolute inset-0 bg-cream">
        <div className="absolute inset-0 opacity-30">
          <div 
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-light rounded-full blur-3xl animate-pulse"
            style={{ animationDuration: '8s' }}
          />
          <div 
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-200/40 rounded-full blur-3xl animate-pulse"
            style={{ animationDuration: '12s', animationDelay: '2s' }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-20">
        {eyebrow && (
          <p className="font-mono uppercase tracking-[0.3em] text-xs text-charcoal/60 mb-6">
            {eyebrow}
          </p>
        )}
        
        <h1 className="font-display text-[clamp(2.5rem,11vw,9rem)] leading-[0.85] tracking-tight text-charcoal">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-8 text-lg md:text-xl text-charcoal/70 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}

        {ctaText && (
          <div className="mt-10">
            <a href={ctaHref}>
              <Button variant="primary" size="lg">
                {ctaText}
              </Button>
            </a>
          </div>
        )}
      </div>

      {/* Wave */}
      {showWave && <WaveTransition fillColor="var(--color-cream)" />}
    </section>
  );
}
