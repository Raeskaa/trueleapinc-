import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = '', hover = true }: CardProps) {
  return (
    <div
      className={`
        relative rounded-lg overflow-hidden bg-white border border-border shadow-sm
        ${hover ? 'transition-all duration-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5' : ''}
        ${className}
      `}
      style={{ transitionTimingFunction: 'var(--ease-premium)' }}
    >
      {children}
    </div>
  );
}

interface CardImageProps {
  src: string;
  alt: string;
  aspectRatio?: '4/3' | '16/9' | '1/1';
  className?: string;
}

export function CardImage({ src, alt, aspectRatio = '4/3', className = '' }: CardImageProps) {
  const ratioClass = {
    '4/3': 'aspect-[4/3]',
    '16/9': 'aspect-video',
    '1/1': 'aspect-square',
  }[aspectRatio];

  return (
    <div className={`relative ${ratioClass} overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        style={{ transitionTimingFunction: 'var(--ease-premium)' }}
        loading="lazy"
      />
    </div>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}
