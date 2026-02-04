import { lazy, Suspense, useEffect, useState, useCallback } from 'react';
import React from 'react';
import { GlobeFallback } from './GlobeFallback';
import { InfoPanel } from './InfoPanel';
import { type NetworkCluster, getClusterById } from './networkData';

// Lazy load the heavy Three.js component
const GlobeScene = lazy(() => 
  import('./GlobeScene').then(mod => ({ default: mod.GlobeScene }))
);

interface GlobeProps {
  className?: string;
}

export function Globe({ className = '' }: GlobeProps) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [selectedCluster, setSelectedCluster] = useState<NetworkCluster | null>(null);

  useEffect(() => {
    // Only load if we're in the browser
    if (typeof window === 'undefined') return;
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return; // Keep showing fallback
    }

    // Use intersection observer to defer loading
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' }
    );

    const element = document.getElementById('globe-container');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  const handleClusterClick = useCallback((cluster: NetworkCluster) => {
    setSelectedCluster(cluster);
  }, []);

  const handleClosePanel = useCallback(() => {
    setSelectedCluster(null);
  }, []);

  if (hasError) {
    return (
      <div id="globe-container" className={`relative w-full h-full ${className}`}>
        <GlobeFallback />
      </div>
    );
  }

  return (
    <div id="globe-container" className={`relative w-full h-full ${className}`}>
      {shouldLoad ? (
        <Suspense fallback={<GlobeFallback />}>
          <ErrorBoundary onError={() => setHasError(true)}>
            <GlobeScene 
              onClusterClick={handleClusterClick}
              selectedCluster={selectedCluster?.id || null}
            />
          </ErrorBoundary>
        </Suspense>
      ) : (
        <GlobeFallback />
      )}
      
      {/* Info Panel */}
      <InfoPanel 
        cluster={selectedCluster} 
        onClose={handleClosePanel} 
      />
      
      {/* Instructions overlay */}
      {shouldLoad && !selectedCluster && (
        <div className="absolute bottom-4 left-4 text-xs text-muted pointer-events-none">
          <p>Drag to rotate • Scroll to zoom • Click a node for details</p>
        </div>
      )}
    </div>
  );
}

// Simple error boundary
interface ErrorBoundaryProps {
  children: React.ReactNode;
  onError: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}
