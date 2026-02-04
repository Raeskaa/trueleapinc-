import { useEffect, useRef, useState } from 'react';

interface Layer {
  id: string;
  name: string;
  shortName: string;
  gradient: string;
}

const layers: Layer[] = [
  {
    id: 'physical',
    name: 'Physical Infrastructure',
    shortName: 'Hardware',
    gradient: 'from-primary/90 to-primary',
  },
  {
    id: 'network',
    name: 'Network Layer',
    shortName: 'Connectivity',
    gradient: 'from-violet/90 to-violet',
  },
  {
    id: 'edge-ai',
    name: 'Edge AI Engine',
    shortName: 'Intelligence',
    gradient: 'from-primary-light/90 to-primary-light',
  },
  {
    id: 'applications',
    name: 'Applications',
    shortName: 'Interface',
    gradient: 'from-violet/80 to-primary-light',
  },
];

interface Props {
  className?: string;
}

export default function IsometricStackDiagram({ className = '' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeLayer, setActiveLayer] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Simple visibility trigger
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full aspect-square max-w-md mx-auto ${className}`}
      style={{ perspective: '1000px' }}
    >
      {/* Isometric container */}
      <div
        className="relative w-full h-full"
        style={{
          transformStyle: 'preserve-3d',
          transform: 'rotateX(60deg) rotateZ(-45deg)',
        }}
      >
        {layers.map((layer, index) => (
          <div
            key={layer.id}
            className={`absolute inset-x-8 cursor-pointer transition-all duration-500 ${
              activeLayer && activeLayer !== layer.id ? 'opacity-40' : 'opacity-100'
            }`}
            style={{
              bottom: `${index * 22 + 4}%`,
              height: '18%',
              transformStyle: 'preserve-3d',
              transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
              transitionDelay: `${index * 100}ms`,
            }}
            onMouseEnter={() => setActiveLayer(layer.id)}
            onMouseLeave={() => setActiveLayer(null)}
          >
            {/* Top face */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${layer.gradient} rounded-lg`}
              style={{
                transform: 'translateZ(24px)',
                boxShadow: activeLayer === layer.id
                  ? '0 0 40px rgba(87, 39, 143, 0.5)'
                  : '0 4px 20px rgba(0,0,0,0.15)',
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white drop-shadow-sm">
                  <p className="text-[10px] font-medium opacity-80 mb-0.5">
                    L{index + 1}
                  </p>
                  <p className="text-sm font-semibold tracking-tight">
                    {layer.shortName}
                  </p>
                </div>
              </div>
            </div>

            {/* Front face */}
            <div
              className={`absolute inset-x-0 bottom-0 bg-gradient-to-b ${layer.gradient}`}
              style={{
                height: '24px',
                transform: 'rotateX(-90deg)',
                transformOrigin: 'bottom',
                opacity: 0.7,
              }}
            />

            {/* Right face */}
            <div
              className={`absolute inset-y-0 right-0 bg-gradient-to-l ${layer.gradient}`}
              style={{
                width: '24px',
                transform: 'rotateY(90deg)',
                transformOrigin: 'right',
                opacity: 0.5,
              }}
            />
          </div>
        ))}
      </div>

      {/* Layer labels on the side */}
      <div className="absolute -right-2 top-1/2 -translate-y-1/2 translate-x-full pl-6 hidden lg:block">
        <div className="space-y-3">
          {[...layers].reverse().map((layer, i) => (
            <div
              key={layer.id}
              className={`flex items-center gap-2 text-xs transition-all duration-200 ${
                activeLayer === layer.id ? 'text-primary font-medium' : 'text-muted'
              }`}
            >
              <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${layer.gradient}`} />
              <span>{layer.shortName}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
