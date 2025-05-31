import React, { useState, useEffect, useRef } from 'react';

interface AnimatedTextProps {
  text: string;
  className?: string;
  speed?: number; // Characters per frame (higher = faster)
  onComplete?: () => void;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  className = '',
  speed = 1,
  onComplete
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const animationRef = useRef<number | null>(null);
  const indexRef = useRef(0);
  const lastUpdateTimeRef = useRef(0);
  const frameIntervalMs = 16; // ~60fps

  useEffect(() => {
    // Reset when text changes
    setDisplayedText('');
    setIsComplete(false);
    indexRef.current = 0;
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    const animate = (timestamp: number) => {
      if (timestamp - lastUpdateTimeRef.current >= frameIntervalMs) {
        lastUpdateTimeRef.current = timestamp;
        
        if (indexRef.current < text.length) {
          // Add multiple characters per frame based on speed
          const charsToAdd = Math.min(speed, text.length - indexRef.current);
          const nextIndex = indexRef.current + charsToAdd;
          const nextText = text.substring(0, nextIndex);
          
          setDisplayedText(nextText);
          indexRef.current = nextIndex;
        } else if (!isComplete) {
          setIsComplete(true);
          onComplete?.();
          return; // Stop animation
        }
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [text, speed, onComplete]);

  return <div className={className}>{displayedText}</div>;
}; 