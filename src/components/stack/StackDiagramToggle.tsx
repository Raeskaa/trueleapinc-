import { useState } from 'react';
import IsometricStackDiagram from './IsometricStackDiagram';
import ParticleFlowDiagram from './ParticleFlowDiagram';

type DiagramView = 'isometric' | 'flow';

interface Props {
  className?: string;
  defaultView?: DiagramView;
}

export default function StackDiagramToggle({ className = '', defaultView = 'isometric' }: Props) {
  const [view, setView] = useState<DiagramView>(defaultView);

  return (
    <div className={className}>
      {/* Toggle buttons */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <button
          onClick={() => setView('isometric')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
            view === 'isometric'
              ? 'bg-primary text-white shadow-md'
              : 'bg-white text-muted border border-border hover:border-primary/50 hover:text-charcoal'
          }`}
          aria-pressed={view === 'isometric'}
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            3D Stack
          </span>
        </button>
        <button
          onClick={() => setView('flow')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
            view === 'flow'
              ? 'bg-primary text-white shadow-md'
              : 'bg-white text-muted border border-border hover:border-primary/50 hover:text-charcoal'
          }`}
          aria-pressed={view === 'flow'}
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Data Flow
          </span>
        </button>
      </div>

      {/* Diagram container with transitions */}
      <div className="relative min-h-[400px]">
        <div
          className={`absolute inset-0 transition-all duration-500 ${
            view === 'isometric'
              ? 'opacity-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
        >
          <IsometricStackDiagram />
        </div>
        <div
          className={`absolute inset-0 transition-all duration-500 ${
            view === 'flow'
              ? 'opacity-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
        >
          <ParticleFlowDiagram />
        </div>
      </div>

      {/* View description */}
      <p className="text-center text-sm text-muted mt-6">
        {view === 'isometric'
          ? 'Interactive 3D view showing the layered architecture'
          : 'Animated view showing data flow between layers'}
      </p>
    </div>
  );
}
