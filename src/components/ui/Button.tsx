import type { ReactNode, ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  showStatus?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-light shadow-sm hover:shadow-md',
  secondary: 'bg-charcoal text-cream hover:bg-charcoal/90 shadow-sm hover:shadow-md',
  ghost: 'bg-transparent text-charcoal hover:bg-charcoal/5',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  showStatus = false,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2 rounded-lg
        font-medium transition-all duration-300
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
        disabled:opacity-50 disabled:pointer-events-none
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      style={{ transitionTimingFunction: 'var(--ease-premium)' }}
      {...props}
    >
      {showStatus && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success/75 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
        </span>
      )}
      {children}
    </button>
  );
}

interface PillButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function PillButton({ children, className = '', ...props }: PillButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center gap-2 px-4 py-2 rounded-lg
        bg-white text-charcoal font-mono uppercase tracking-[0.2em] text-xs font-medium
        border border-border shadow-sm
        hover:border-charcoal hover:shadow-md transition-all duration-300
        ${className}
      `}
      style={{ transitionTimingFunction: 'var(--ease-premium)' }}
      {...props}
    >
      {children}
    </button>
  );
}
