interface WireframePlaceholderProps {
  variant: 'dashboard' | 'mobile' | 'photo' | 'hardware' | 'logo' | 'chart' | 'map';
  label?: string;
  className?: string;
  aspect?: '16:9' | '4:3' | '1:1' | '21:9' | '3:4';
  dark?: boolean;
}

const aspectClasses = {
  '16:9': 'aspect-video',
  '4:3': 'aspect-[4/3]',
  '1:1': 'aspect-square',
  '21:9': 'aspect-[21/9]',
  '3:4': 'aspect-[3/4]',
};

export function WireframePlaceholder({
  variant,
  label,
  className = '',
  aspect = '16:9',
  dark = false,
}: WireframePlaceholderProps) {
  const bgColor = dark ? 'bg-charcoal-light' : 'bg-paper';
  const strokeColor = dark ? 'stroke-white/10' : 'stroke-ink/10';
  const textColor = dark ? 'text-white/30' : 'text-ink/30';
  const fillColor = dark ? 'fill-white/5' : 'fill-ink/5';

  return (
    <div className={`${aspectClasses[aspect]} ${bgColor} ${className} relative overflow-hidden`}>
      <svg 
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 400 225"
        preserveAspectRatio="xMidYMid slice"
      >
        {variant === 'dashboard' && (
          <>
            {/* Top nav bar */}
            <rect x="0" y="0" width="400" height="24" className={fillColor} />
            <rect x="12" y="8" width="40" height="8" rx="2" className={fillColor} />
            <circle cx="380" cy="12" r="6" className={fillColor} />
            
            {/* Sidebar */}
            <rect x="0" y="24" width="60" height="201" className={fillColor} />
            <rect x="12" y="40" width="36" height="6" rx="1" className={fillColor} />
            <rect x="12" y="56" width="28" height="6" rx="1" className={fillColor} />
            <rect x="12" y="72" width="32" height="6" rx="1" className={fillColor} />
            <rect x="12" y="88" width="24" height="6" rx="1" className={fillColor} />
            
            {/* Main content area - cards */}
            <rect x="76" y="40" width="100" height="60" rx="4" className={strokeColor} fill="none" strokeWidth="1" />
            <rect x="192" y="40" width="100" height="60" rx="4" className={strokeColor} fill="none" strokeWidth="1" />
            <rect x="308" y="40" width="76" height="60" rx="4" className={strokeColor} fill="none" strokeWidth="1" />
            
            {/* Chart area */}
            <rect x="76" y="116" width="156" height="93" rx="4" className={strokeColor} fill="none" strokeWidth="1" />
            <polyline points="92,180 120,160 150,170 180,140 210,155" className={strokeColor} fill="none" strokeWidth="1.5" />
            
            {/* Table area */}
            <rect x="248" y="116" width="136" height="93" rx="4" className={strokeColor} fill="none" strokeWidth="1" />
            <line x1="248" y1="140" x2="384" y2="140" className={strokeColor} strokeWidth="1" />
            <line x1="248" y1="160" x2="384" y2="160" className={strokeColor} strokeWidth="1" />
            <line x1="248" y1="180" x2="384" y2="180" className={strokeColor} strokeWidth="1" />
          </>
        )}

        {variant === 'mobile' && (
          <>
            {/* Phone frame */}
            <rect x="140" y="12" width="120" height="200" rx="12" className={strokeColor} fill="none" strokeWidth="2" />
            {/* Status bar */}
            <rect x="160" y="20" width="40" height="4" rx="2" className={fillColor} />
            {/* Screen content */}
            <rect x="152" y="36" width="96" height="40" rx="4" className={fillColor} />
            <rect x="152" y="84" width="60" height="8" rx="2" className={fillColor} />
            <rect x="152" y="100" width="80" height="6" rx="2" className={fillColor} />
            <rect x="152" y="112" width="70" height="6" rx="2" className={fillColor} />
            {/* Bottom nav */}
            <rect x="152" y="180" width="96" height="20" rx="4" className={fillColor} />
            <circle cx="172" cy="190" r="4" className={strokeColor} fill="none" strokeWidth="1" />
            <circle cx="200" cy="190" r="4" className={strokeColor} fill="none" strokeWidth="1" />
            <circle cx="228" cy="190" r="4" className={strokeColor} fill="none" strokeWidth="1" />
          </>
        )}

        {variant === 'photo' && (
          <>
            {/* Rule of thirds grid */}
            <line x1="133" y1="0" x2="133" y2="225" className={strokeColor} strokeWidth="1" strokeDasharray="4 4" />
            <line x1="267" y1="0" x2="267" y2="225" className={strokeColor} strokeWidth="1" strokeDasharray="4 4" />
            <line x1="0" y1="75" x2="400" y2="75" className={strokeColor} strokeWidth="1" strokeDasharray="4 4" />
            <line x1="0" y1="150" x2="400" y2="150" className={strokeColor} strokeWidth="1" strokeDasharray="4 4" />
            
            {/* Subject silhouette */}
            <ellipse cx="200" cy="90" rx="35" ry="40" className={fillColor} />
            <ellipse cx="200" cy="180" rx="60" ry="50" className={fillColor} />
          </>
        )}

        {variant === 'hardware' && (
          <>
            {/* Device outline */}
            <rect x="100" y="50" width="200" height="125" rx="8" className={strokeColor} fill="none" strokeWidth="2" />
            {/* Screen */}
            <rect x="120" y="65" width="100" height="60" rx="2" className={fillColor} />
            {/* Ports/indicators */}
            <circle cx="270" cy="80" r="4" className={fillColor} />
            <circle cx="270" cy="95" r="4" className={fillColor} />
            <circle cx="270" cy="110" r="4" className={strokeColor} fill="none" strokeWidth="1" />
            {/* Antenna */}
            <line x1="250" y1="50" x2="250" y2="30" className={strokeColor} strokeWidth="2" />
            <circle cx="250" cy="25" r="5" className={strokeColor} fill="none" strokeWidth="1" />
            {/* Base/stand */}
            <rect x="150" y="175" width="100" height="12" rx="2" className={fillColor} />
          </>
        )}

        {variant === 'logo' && (
          <>
            {/* Logo placeholder shape */}
            <rect x="150" y="80" width="100" height="40" rx="4" className={strokeColor} fill="none" strokeWidth="1.5" />
            {/* Company name line */}
            <rect x="130" y="135" width="140" height="10" rx="2" className={fillColor} />
          </>
        )}

        {variant === 'chart' && (
          <>
            {/* Axes */}
            <line x1="50" y1="25" x2="50" y2="200" className={strokeColor} strokeWidth="1.5" />
            <line x1="50" y1="200" x2="380" y2="200" className={strokeColor} strokeWidth="1.5" />
            
            {/* Grid lines */}
            <line x1="50" y1="60" x2="380" y2="60" className={strokeColor} strokeWidth="0.5" strokeDasharray="4 4" />
            <line x1="50" y1="100" x2="380" y2="100" className={strokeColor} strokeWidth="0.5" strokeDasharray="4 4" />
            <line x1="50" y1="140" x2="380" y2="140" className={strokeColor} strokeWidth="0.5" strokeDasharray="4 4" />
            
            {/* Bars */}
            <rect x="80" y="100" width="40" height="100" className={fillColor} />
            <rect x="140" y="60" width="40" height="140" className={fillColor} />
            <rect x="200" y="80" width="40" height="120" className={fillColor} />
            <rect x="260" y="120" width="40" height="80" className={fillColor} />
            <rect x="320" y="50" width="40" height="150" className={fillColor} />
          </>
        )}

        {variant === 'map' && (
          <>
            {/* Continental outlines - simplified */}
            <ellipse cx="120" cy="100" rx="50" ry="60" className={strokeColor} fill="none" strokeWidth="1" />
            <ellipse cx="200" cy="80" rx="40" ry="50" className={strokeColor} fill="none" strokeWidth="1" />
            <ellipse cx="280" cy="110" rx="60" ry="70" className={strokeColor} fill="none" strokeWidth="1" />
            
            {/* Data points */}
            <circle cx="100" cy="90" r="4" className={fillColor} />
            <circle cx="140" cy="110" r="6" className={fillColor} />
            <circle cx="190" cy="85" r="5" className={fillColor} />
            <circle cx="250" cy="100" r="8" className={fillColor} />
            <circle cx="300" cy="120" r="5" className={fillColor} />
            <circle cx="320" cy="90" r="4" className={fillColor} />
            
            {/* Connection lines */}
            <line x1="140" y1="110" x2="190" y2="85" className={strokeColor} strokeWidth="1" strokeDasharray="2 2" />
            <line x1="190" y1="85" x2="250" y2="100" className={strokeColor} strokeWidth="1" strokeDasharray="2 2" />
          </>
        )}
      </svg>

      {/* Label */}
      {label && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-xs font-medium ${textColor} tracking-wide uppercase`}>
            {label}
          </span>
        </div>
      )}
    </div>
  );
}
