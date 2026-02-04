import { lazy, Suspense, useEffect, useState } from 'react';
import { GlobeFallback } from './GlobeFallback';

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

  useEffect(() => {
    // Only load if we're in the browser and have good connection
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

  if (hasError) {
    return <GlobeFallback />;
  }

  return (
    <div id="globe-container" className={className}>
      {shouldLoad ? (
        <Suspense fallback={<GlobeFallback />}>
          <ErrorBoundary onError={() => setHasError(true)}>
            <GlobeScene />
          </ErrorBoundary>
        </Suspense>
      ) : (
        <GlobeFallback />
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

import React from 'react';
