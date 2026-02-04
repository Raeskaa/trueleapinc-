import type { ReactNode } from 'react';

interface MarqueeItem {
  type: 'quote' | 'metric' | 'case-study' | 'logo';
  content: ReactNode;
  attribution?: string;
  metric?: string;
  label?: string;
}

interface TestimonialMarqueeProps {
  items: MarqueeItem[];
  direction?: 'left' | 'right';
  speed?: 'slow' | 'normal' | 'fast';
  pauseOnHover?: boolean;
  variant?: 'light' | 'dark';
}

export function TestimonialMarquee({
  items,
  direction = 'left',
  speed = 'normal',
  pauseOnHover = true,
  variant = 'light',
}: TestimonialMarqueeProps) {
  const speedDuration = {
    slow: '60s',
    normal: '40s',
    fast: '25s',
  };

  const isDark = variant === 'dark';

  // Duplicate items for seamless loop
  const duplicatedItems = [...items, ...items];

  return (
    <div className="relative overflow-hidden py-4">
      {/* Gradient masks */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
        style={{
          background: isDark 
            ? 'linear-gradient(to right, rgb(26, 26, 26), transparent)'
            : 'linear-gradient(to right, rgb(245, 244, 240), transparent)'
        }}
      />
      <div 
        className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
        style={{
          background: isDark 
            ? 'linear-gradient(to left, rgb(26, 26, 26), transparent)'
            : 'linear-gradient(to left, rgb(245, 244, 240), transparent)'
        }}
      />

      {/* Marquee track */}
      <div
        className={`flex gap-5 ${pauseOnHover ? 'hover:[animation-play-state:paused]' : ''}`}
        style={{
          animation: `marquee ${speedDuration[speed]} linear infinite`,
          animationDirection: direction === 'right' ? 'reverse' : 'normal',
        }}
      >
        {duplicatedItems.map((item, index) => (
          <div 
            key={index} 
            className={`flex-shrink-0 w-80 p-6 rounded-lg transition-shadow duration-300 ${
              isDark 
                ? 'bg-charcoal-light border border-white/10 hover:border-white/20' 
                : 'bg-white border border-border shadow-sm hover:shadow-md'
            }`}
          >
            {item.type === 'quote' && (
              <div className="h-full flex flex-col">
                <svg className={`w-8 h-8 mb-4 ${isDark ? 'text-primary-light' : 'text-primary'} opacity-40`} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <blockquote className={`font-quote text-body flex-1 ${isDark ? 'text-white' : 'text-ink'}`}>
                  {item.content}
                </blockquote>
                {item.attribution && (
                  <p className={`text-small mt-4 pt-4 border-t ${isDark ? 'text-white/60 border-white/10' : 'text-muted border-border'}`}>
                    — {item.attribution}
                  </p>
                )}
              </div>
            )}

            {item.type === 'metric' && (
              <div className="h-full flex flex-col justify-center">
                <p className={`text-4xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-primary'}`}>
                  {item.metric}
                </p>
                <p className={`text-small ${isDark ? 'text-white/60' : 'text-muted'}`}>
                  {item.label}
                </p>
              </div>
            )}

            {item.type === 'case-study' && (
              <div className="h-full flex flex-col">
                <span className={`inline-block text-caption px-2 py-1 rounded mb-3 w-fit ${
                  isDark ? 'bg-primary/20 text-primary-light' : 'bg-primary-lighter text-primary'
                }`}>
                  Case Study
                </span>
                <p className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-ink'}`}>
                  {item.content}
                </p>
                {item.label && (
                  <p className={`text-small ${isDark ? 'text-white/60' : 'text-muted'}`}>
                    {item.label}
                  </p>
                )}
              </div>
            )}

            {item.type === 'logo' && (
              <div className="h-full flex flex-col justify-center">
                <p className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-ink'}`}>
                  {item.content}
                </p>
                {item.label && (
                  <p className={`text-small mt-2 ${isDark ? 'text-white/60' : 'text-muted'}`}>
                    {item.label}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Example usage data
export const sampleTestimonials: MarqueeItem[] = [
  {
    type: 'quote',
    content: 'TrueLeap transformed how we deliver education to remote communities.',
    attribution: 'Ministry of Education, Rwanda',
  },
  {
    type: 'metric',
    metric: '2,500+',
    label: 'Schools connected in Rwanda',
  },
  {
    type: 'case-study',
    content: 'Pacific Island Emergency Network',
    label: '48hr deployment across 12 nations',
  },
  {
    type: 'logo',
    content: 'UNICEF',
    label: 'Global partner since 2021',
  },
  {
    type: 'quote',
    content: 'Finally, infrastructure that works where we need it most.',
    attribution: 'GIZ Regional Director',
  },
  {
    type: 'metric',
    metric: '340%',
    label: 'Yield increase for farmers in Ghana',
  },
];
