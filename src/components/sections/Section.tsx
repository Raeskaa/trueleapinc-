import type { ReactNode } from 'react';

type SectionVariant = 'light' | 'dark' | 'cream';

interface SectionProps {
  children: ReactNode;
  variant?: SectionVariant;
  className?: string;
  id?: string;
}

const variantClasses: Record<SectionVariant, string> = {
  light: 'bg-white text-charcoal',
  dark: 'bg-charcoal text-white',
  cream: 'bg-cream text-charcoal',
};

export function Section({ 
  children, 
  variant = 'cream', 
  className = '',
  id,
}: SectionProps) {
  return (
    <section 
      id={id}
      className={`py-20 md:py-32 ${variantClasses[variant]} ${className}`}
    >
      <div className="max-w-7xl mx-auto px-6">
        {children}
      </div>
    </section>
  );
}

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
}

export function SectionHeader({ 
  eyebrow, 
  title, 
  description,
  align = 'left',
}: SectionHeaderProps) {
  const alignClass = align === 'center' ? 'text-center mx-auto' : '';
  
  return (
    <div className={`max-w-3xl mb-16 ${alignClass}`}>
      {eyebrow && (
        <p className="font-mono uppercase tracking-[0.3em] text-xs opacity-60 mb-4">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-6 text-lg opacity-70">
          {description}
        </p>
      )}
    </div>
  );
}

interface GridProps {
  children: ReactNode;
  cols?: 2 | 3 | 4;
  className?: string;
}

export function Grid({ children, cols = 2, className = '' }: GridProps) {
  const colsClass = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  }[cols];

  return (
    <div className={`grid gap-8 ${colsClass} ${className}`}>
      {children}
    </div>
  );
}
