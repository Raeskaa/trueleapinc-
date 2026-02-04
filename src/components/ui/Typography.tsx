import type { ReactNode } from 'react';

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4';

interface DisplayProps {
  as?: HeadingLevel;
  children: ReactNode;
  className?: string;
  italic?: boolean;
}

export function Display({ 
  as: Tag = 'h1', 
  children, 
  className = '',
  italic = false 
}: DisplayProps) {
  return (
    <Tag 
      className={`font-display leading-[0.85] tracking-tight ${italic ? 'italic' : ''} ${className}`}
    >
      {children}
    </Tag>
  );
}

interface MonoProps {
  children: ReactNode;
  className?: string;
  as?: 'span' | 'p' | 'div';
}

export function Mono({ children, className = '', as: Tag = 'span' }: MonoProps) {
  return (
    <Tag className={`font-mono uppercase tracking-[0.3em] text-xs ${className}`}>
      {children}
    </Tag>
  );
}

interface BodyProps {
  children: ReactNode;
  className?: string;
  size?: 'sm' | 'base' | 'lg';
}

const sizeClasses = {
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
};

export function Body({ children, className = '', size = 'base' }: BodyProps) {
  return (
    <p className={`font-body leading-relaxed ${sizeClasses[size]} ${className}`}>
      {children}
    </p>
  );
}
