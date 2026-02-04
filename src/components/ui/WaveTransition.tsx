interface WaveTransitionProps {
  fillColor?: string;
  className?: string;
}

export function WaveTransition({ 
  fillColor = 'var(--color-cream)', 
  className = '' 
}: WaveTransitionProps) {
  return (
    <div className={`absolute bottom-0 left-0 right-0 h-[25vh] overflow-hidden pointer-events-none ${className}`}>
      <div 
        className="absolute w-[120%] h-[200%] left-1/2 -translate-x-1/2 translate-y-[20%] rounded-[50%_50%_0_0]"
        style={{ backgroundColor: fillColor }}
      />
    </div>
  );
}

interface WaveTransitionInvertedProps {
  fillColor?: string;
  className?: string;
}

export function WaveTransitionInverted({ 
  fillColor = 'var(--color-charcoal)', 
  className = '' 
}: WaveTransitionInvertedProps) {
  return (
    <div className={`relative w-full h-[25vh] overflow-hidden ${className}`}>
      <div 
        className="absolute w-[120%] h-[200%] left-1/2 -translate-x-1/2 -translate-y-[80%] rounded-[0_0_50%_50%]"
        style={{ backgroundColor: fillColor }}
      />
    </div>
  );
}
