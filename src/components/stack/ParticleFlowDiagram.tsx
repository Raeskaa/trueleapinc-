import { useEffect, useRef, useState, useCallback } from 'react';

interface Layer {
  id: string;
  name: string;
  shortName: string;
  icon: string;
}

const layers: Layer[] = [
  { id: 'physical', name: 'Physical Infrastructure', shortName: 'Hardware', icon: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z' },
  { id: 'network', name: 'Network Layer', shortName: 'Connectivity', icon: 'M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0' },
  { id: 'edge-ai', name: 'Edge AI Engine', shortName: 'Intelligence', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { id: 'applications', name: 'Applications', shortName: 'Interface', icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z' },
];

interface Particle {
  id: number;
  startY: number;
  targetLayer: number;
  progress: number;
  speed: number;
}

interface Props {
  className?: string;
}

export default function ParticleFlowDiagram({ className = '' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  const [activeLayer, setActiveLayer] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const initParticles = useCallback(() => {
    particlesRef.current = [];
    for (let i = 0; i < 12; i++) {
      particlesRef.current.push({
        id: i,
        startY: Math.random(),
        targetLayer: Math.floor(Math.random() * 4),
        progress: Math.random(),
        speed: 0.002 + Math.random() * 0.003,
      });
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    initParticles();
    return () => clearTimeout(timer);
  }, [initParticles]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateCanvasSize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    const animate = () => {
      const rect = container.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Layer Y positions (from bottom: Hardware, Network, AI, Apps)
      const layerYPositions = [
        rect.height * 0.85,
        rect.height * 0.62,
        rect.height * 0.39,
        rect.height * 0.16,
      ];
      const targetX = rect.width - 80;

      particlesRef.current.forEach((particle) => {
        particle.progress += particle.speed;

        if (particle.progress >= 1) {
          particle.progress = 0;
          particle.targetLayer = Math.floor(Math.random() * 4);
          particle.startY = Math.random();
          particle.speed = 0.002 + Math.random() * 0.003;
        }

        const startX = 10;
        const startY = particle.startY * rect.height;
        const endX = targetX;
        const endY = layerYPositions[particle.targetLayer];

        // Bezier curve control point
        const ctrlX = rect.width * 0.4;
        const ctrlY = (startY + endY) / 2 + (Math.random() - 0.5) * 30;

        const t = particle.progress;
        const x = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * ctrlX + t * t * endX;
        const y = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * ctrlY + t * t * endY;

        // Draw particle glow
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 6);
        const hue = particle.targetLayer % 2 === 0 ? 280 : 300; // purple tones
        gradient.addColorStop(0, `hsla(${hue}, 60%, 50%, 0.8)`);
        gradient.addColorStop(1, `hsla(${hue}, 60%, 50%, 0)`);

        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw trail
        const trailT = Math.max(0, t - 0.08);
        const trailX = (1 - trailT) * (1 - trailT) * startX + 2 * (1 - trailT) * trailT * ctrlX + trailT * trailT * endX;
        const trailY = (1 - trailT) * (1 - trailT) * startY + 2 * (1 - trailT) * trailT * ctrlY + trailT * trailT * endY;

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(trailX, trailY);
        ctx.strokeStyle = `hsla(${hue}, 60%, 50%, 0.3)`;
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full aspect-[4/5] max-w-md mx-auto ${className}`}
    >
      {/* Canvas for particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
      />

      {/* Layer cards */}
      <div className="relative h-full flex flex-col justify-between py-6 pl-12 pr-2">
        {[...layers].reverse().map((layer, index) => (
          <div
            key={layer.id}
            className={`relative flex items-center gap-3 p-3 rounded-xl bg-white border transition-all duration-300 cursor-pointer ${
              activeLayer === layer.id
                ? 'border-primary shadow-lg scale-[1.02]'
                : 'border-border hover:border-primary/50'
            }`}
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(-20px)',
              transitionDelay: `${index * 80}ms`,
            }}
            onMouseEnter={() => setActiveLayer(layer.id)}
            onMouseLeave={() => setActiveLayer(null)}
          >
            {/* Layer number badge */}
            <div className="absolute -left-10 w-6 h-6 rounded-full bg-gradient-to-br from-primary to-violet flex items-center justify-center text-white text-xs font-semibold shadow-md">
              {4 - index}
            </div>

            {/* Icon */}
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <svg
                className="w-4 h-4 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d={layer.icon} />
              </svg>
            </div>

            {/* Text */}
            <div className="min-w-0 flex-1">
              <p className="text-[10px] text-muted mb-0.5">{layer.shortName}</p>
              <p className="text-xs font-medium text-charcoal truncate">
                {layer.name}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Data flow label */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 -rotate-90 text-[10px] text-muted/60 font-medium tracking-widest whitespace-nowrap uppercase">
        Data Flow
      </div>
    </div>
  );
}
