'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimateSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function AnimateSection({ children, className, delay = 0 }: AnimateSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={cn(isVisible && 'animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out', !isVisible && 'opacity-0', className)}>
      {children}
    </div>
  );
}
