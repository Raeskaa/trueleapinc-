// Enhanced SVG fallback while Three.js globe loads - Light mode
export function GlobeFallback() {
  return (
    <div className="relative w-full h-full min-h-[400px] flex items-center justify-center bg-transparent">
      <svg viewBox="0 0 400 400" className="w-full h-full max-w-lg max-h-lg">
        {/* Definitions */}
        <defs>
          <radialGradient id="globe-bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f9fafb" />
            <stop offset="100%" stopColor="#f3f4f6" />
          </radialGradient>
          <radialGradient id="globe-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#5a2d82" stopOpacity="0.1" />
            <stop offset="70%" stopColor="#5a2d82" stopOpacity="0.05" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <linearGradient id="arc-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#5a2d82" stopOpacity="0" />
            <stop offset="50%" stopColor="#5a2d82" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#5a2d82" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Outer glow */}
        <circle cx="200" cy="200" r="160" fill="url(#globe-glow)" />
        
        {/* Globe background */}
        <circle cx="200" cy="200" r="120" fill="url(#globe-bg)" />
        
        {/* Grid lines */}
        <g opacity="0.2" stroke="#d1d5db" strokeWidth="0.5" fill="none">
          {/* Latitude lines */}
          {[-60, -30, 0, 30, 60].map((lat, i) => {
            const y = 200 + lat * 1.2;
            const r = Math.sqrt(120 * 120 - (lat * 1.2) * (lat * 1.2));
            return (
              <ellipse
                key={`lat-${i}`}
                cx="200"
                cy={y}
                rx={r}
                ry={r * 0.25}
              />
            );
          })}
          {/* Longitude lines */}
          {[0, 30, 60, 90, 120, 150].map((lon, i) => (
            <ellipse
              key={`lon-${i}`}
              cx="200"
              cy="200"
              rx={120 * Math.cos(lon * Math.PI / 180)}
              ry="120"
              transform={`rotate(${lon} 200 200)`}
            />
          ))}
        </g>
        
        {/* Simplified continent dots */}
        <g fill="#9ca3af" opacity="0.6">
          {/* Africa */}
          <circle cx="215" cy="210" r="2" />
          <circle cx="220" cy="200" r="1.5" />
          <circle cx="210" cy="220" r="1.8" />
          <circle cx="225" cy="215" r="1.5" />
          <circle cx="205" cy="205" r="1.5" />
          
          {/* Europe */}
          <circle cx="210" cy="170" r="1.5" />
          <circle cx="220" cy="165" r="1.2" />
          <circle cx="200" cy="175" r="1.2" />
          
          {/* Asia */}
          <circle cx="260" cy="180" r="2" />
          <circle cx="270" cy="190" r="1.8" />
          <circle cx="280" cy="200" r="1.5" />
          <circle cx="250" cy="175" r="1.5" />
          
          {/* Americas */}
          <circle cx="130" cy="180" r="1.8" />
          <circle cx="125" cy="200" r="1.5" />
          <circle cx="140" cy="230" r="1.5" />
          <circle cx="135" cy="250" r="1.2" />
        </g>
        
        {/* Network nodes - animated */}
        {[
          { x: 215, y: 210, delay: 0 },    // Nairobi
          { x: 195, y: 195, delay: 0.3 },  // Lagos
          { x: 260, y: 180, delay: 0.6 },  // Delhi
          { x: 280, y: 210, delay: 0.9 },  // Jakarta
          { x: 130, y: 240, delay: 1.2 },  // São Paulo
        ].map((node, i) => (
          <g key={i}>
            {/* Pulse ring */}
            <circle
              cx={node.x}
              cy={node.y}
              r="8"
              fill="none"
              stroke="#5a2d82"
              strokeWidth="1"
              opacity="0.4"
            >
              <animate
                attributeName="r"
                values="4;12;4"
                dur="2s"
                repeatCount="indefinite"
                begin={`${node.delay}s`}
              />
              <animate
                attributeName="opacity"
                values="0.5;0;0.5"
                dur="2s"
                repeatCount="indefinite"
                begin={`${node.delay}s`}
              />
            </circle>
            {/* Core dot */}
            <circle
              cx={node.x}
              cy={node.y}
              r="3"
              fill="#5a2d82"
            >
              <animate
                attributeName="r"
                values="3;4;3"
                dur="2s"
                repeatCount="indefinite"
                begin={`${node.delay}s`}
              />
            </circle>
          </g>
        ))}
        
        {/* Connection arcs */}
        <g fill="none" stroke="url(#arc-gradient)" strokeWidth="1">
          <path d="M 215 210 Q 230 180 260 180" opacity="0.5">
            <animate
              attributeName="stroke-dashoffset"
              values="100;0"
              dur="3s"
              repeatCount="indefinite"
            />
          </path>
          <path d="M 195 195 Q 165 220 130 240" opacity="0.3">
            <animate
              attributeName="stroke-dashoffset"
              values="100;0"
              dur="4s"
              repeatCount="indefinite"
            />
          </path>
        </g>
        
        {/* Globe outline */}
        <circle 
          cx="200" 
          cy="200" 
          r="120" 
          fill="none" 
          stroke="#5a2d82" 
          strokeWidth="1"
          opacity="0.2"
        />
      </svg>
      
      {/* Loading indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
        <span className="text-xs text-muted uppercase tracking-wider font-mono">Loading Globe</span>
      </div>
    </div>
  );
}
