// SVG fallback while Three.js globe loads
export function GlobeFallback() {
  return (
    <div className="relative w-full aspect-square max-w-lg mx-auto">
      <svg viewBox="0 0 400 400" className="w-full h-full">
        {/* Background glow */}
        <defs>
          <radialGradient id="globe-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--color-indigo)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <linearGradient id="globe-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-indigo)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="var(--color-indigo)" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        
        {/* Outer glow */}
        <circle cx="200" cy="200" r="180" fill="url(#globe-glow)" />
        
        {/* Globe outline */}
        <circle 
          cx="200" 
          cy="200" 
          r="140" 
          fill="none" 
          stroke="url(#globe-gradient)" 
          strokeWidth="1.5"
          opacity="0.8"
        />
        
        {/* Latitude lines */}
        {[-60, -30, 0, 30, 60].map((lat, i) => {
          const y = 200 + lat * 1.5;
          const r = Math.sqrt(140 * 140 - (lat * 1.5) * (lat * 1.5));
          return (
            <ellipse
              key={`lat-${i}`}
              cx="200"
              cy={y}
              rx={r}
              ry={r * 0.3}
              fill="none"
              stroke="var(--color-indigo)"
              strokeWidth="0.5"
              opacity="0.3"
            />
          );
        })}
        
        {/* Longitude lines */}
        {[0, 45, 90, 135].map((lon, i) => (
          <ellipse
            key={`lon-${i}`}
            cx="200"
            cy="200"
            rx={140 * Math.cos(lon * Math.PI / 180)}
            ry="140"
            fill="none"
            stroke="var(--color-indigo)"
            strokeWidth="0.5"
            opacity="0.3"
            transform={`rotate(${lon} 200 200)`}
          />
        ))}
        
        {/* Network nodes - animated */}
        {[
          { x: 180, y: 120 }, // Europe
          { x: 280, y: 180 }, // Asia
          { x: 120, y: 200 }, // Americas
          { x: 220, y: 260 }, // Africa
          { x: 300, y: 280 }, // Oceania
        ].map((node, i) => (
          <g key={`node-${i}`}>
            <circle
              cx={node.x}
              cy={node.y}
              r="4"
              fill="var(--color-indigo)"
              className="animate-pulse"
              style={{ animationDelay: `${i * 0.5}s` }}
            />
            <circle
              cx={node.x}
              cy={node.y}
              r="8"
              fill="none"
              stroke="var(--color-indigo)"
              strokeWidth="1"
              opacity="0.5"
              className="animate-ping"
              style={{ animationDelay: `${i * 0.5}s` }}
            />
          </g>
        ))}
      </svg>
      
      <p className="absolute bottom-0 left-1/2 -translate-x-1/2 font-mono text-xs uppercase tracking-wider text-white/40">
        Loading Interactive Globe...
      </p>
    </div>
  );
}
