import { useEffect, useRef, useState, useCallback } from 'react';

interface TypingHeadlineProps {
  line1: string;
  line2: string;
  typingDelay?: number;
  withSound?: boolean;
  className?: string;
}

export function TypingHeadline({
  line1,
  line2,
  typingDelay = 50,
  withSound = true,
  className = '',
}: TypingHeadlineProps) {
  const [displayedLine2, setDisplayedLine2] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' 
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Create subtle click sound using Web Audio API
  const playClickSound = useCallback(() => {
    if (!withSound || prefersReducedMotion) return;
    
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      // Very subtle, soft click
      oscillator.frequency.setValueAtTime(800 + Math.random() * 200, ctx.currentTime);
      oscillator.type = 'sine';
      
      // Very low volume - barely audible
      gainNode.gain.setValueAtTime(0.02, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.05);
    } catch (e) {
      // Audio not supported, fail silently
    }
  }, [withSound, prefersReducedMotion]);

  useEffect(() => {
    // If reduced motion, show everything immediately
    if (prefersReducedMotion) {
      setDisplayedLine2(line2);
      setIsTypingComplete(true);
      setHasStarted(true);
      return;
    }

    // Start typing after a small delay for the first line to fade in
    const startDelay = setTimeout(() => {
      setHasStarted(true);
    }, 400);

    return () => clearTimeout(startDelay);
  }, [prefersReducedMotion, line2]);

  useEffect(() => {
    if (!hasStarted || prefersReducedMotion) return;

    let currentIndex = 0;
    
    const typeNextChar = () => {
      if (currentIndex < line2.length) {
        setDisplayedLine2(line2.slice(0, currentIndex + 1));
        playClickSound();
        currentIndex++;
        setTimeout(typeNextChar, typingDelay);
      } else {
        // Typing complete
        setTimeout(() => setIsTypingComplete(true), 500);
      }
    };

    typeNextChar();
  }, [hasStarted, line2, typingDelay, playClickSound, prefersReducedMotion]);

  // Cleanup audio context on unmount
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div ref={containerRef} className={className}>
      <h1 className="text-display-xl mb-6">
        {/* Line 1 - Fades in */}
        <span 
          className={`block transition-opacity duration-700 ${
            hasStarted ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {line1}
        </span>
        
        {/* Line 2 - Types character by character */}
        <span className="block display-serif text-gradient">
          {displayedLine2}
          {/* Blinking cursor */}
          <span 
            className={`inline-block w-[3px] h-[0.9em] bg-primary ml-1 align-middle transition-opacity duration-300 ${
              isTypingComplete ? 'opacity-0' : 'animate-blink'
            }`}
            aria-hidden="true"
          />
        </span>
      </h1>
      
      {/* Add blink animation via style tag */}
      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 0.8s infinite;
        }
      `}</style>
    </div>
  );
}
