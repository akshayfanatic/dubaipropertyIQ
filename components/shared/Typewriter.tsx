'use client';

import { useTypewriter } from '@/hooks/useTypewriter';

export interface TypewriterProps {
  text: string;
  speed?: number;
  delay?: number;
  loop?: boolean;
  cursor?: boolean;
  className?: string;
}

export function Typewriter({ text, speed = 50, delay = 0, loop = false, cursor = true, className = '' }: TypewriterProps) {
  const { displayedText, isComplete } = useTypewriter({
    text,
    speed,
    delay,
    loop,
  });

  return (
    <span className={className}>
      {displayedText}
      {cursor && !isComplete && <span className="animate-pulse">|</span>}
    </span>
  );
}
