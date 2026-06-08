'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

const heroStats = [
  { value: 12400, suffix: '+', label: 'Properties tracked' },
  { value: 52, label: 'Dubai areas covered' },
  { value: 34, label: 'Developers rated' },
  { prefix: 'AED', value: 180, suffix: 'B', label: 'Transaction data' },
];

function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let frameId: number | undefined;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      frameId = requestAnimationFrame(() => setDisplayValue(value));
      return () => {
        if (frameId) cancelAnimationFrame(frameId);
      };
    }

    const runCount = () => {
      const duration = 1600;
      const start = performance.now();

      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayValue(Math.round(value * eased));

        if (progress < 1) {
          frameId = requestAnimationFrame(tick);
        }
      };

      frameId = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        runCount();
        observer.disconnect();
      },
      { threshold: 0.4 },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [value]);

  return (
    <span ref={ref} className="tabular-nums">
      {displayValue.toLocaleString('en-US')}
    </span>
  );
}

export function HomeHeroStats({ className }: { className?: string }) {
  return (
    <div className={cn('hidden border-t border-primary-foreground/12 bg-[oklch(0.26_0.08_260.47_/_0.92)] shadow-lg shadow-primary/15 animate-in fade-in duration-700 md:block', className)}>
      <div className="container mx-auto grid grid-cols-2 gap-0 px-4 py-[clamp(1rem,1.8vw,1.5rem)] sm:px-6 md:grid-cols-4 md:gap-6 lg:px-8">
        {heroStats.map((stat, index) => (
          <div
            key={stat.label}
            className={cn(
              'px-2 text-center',
              index % 2 === 1 && 'border-l border-primary-foreground/10 md:border-l',
              index > 1 && 'border-t border-primary-foreground/10 md:border-t-0',
              index > 0 && 'md:border-l md:border-primary-foreground/10',
            )}
          >
            <div className="inline-flex items-baseline justify-center gap-1 font-bold leading-none text-primary-foreground text-[clamp(1.9rem,3.4vw,2.8rem)]">
              {stat.prefix && <span className="text-[0.46em] font-bold text-primary-foreground/70">{stat.prefix}</span>}
              <CountUp value={stat.value} />
              {stat.suffix && <span className="text-[0.5em] font-extrabold text-primary-foreground/80">{stat.suffix}</span>}
            </div>
            <span className="mt-2 block text-sm text-primary-foreground/70">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HomeHeroStatsSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('hidden border-t border-primary-foreground/12 bg-[oklch(0.26_0.08_260.47_/_0.92)] shadow-lg shadow-primary/15 md:block', className)}>
      <div className="container mx-auto grid grid-cols-2 gap-0 px-4 py-[clamp(1rem,1.8vw,1.5rem)] sm:px-6 md:grid-cols-4 md:gap-6 lg:px-8">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className={cn(
              'px-2 text-center',
              index % 2 === 1 && 'border-l border-primary-foreground/10 md:border-l',
              index > 1 && 'border-t border-primary-foreground/10 md:border-t-0',
              index > 0 && 'md:border-l md:border-primary-foreground/10',
            )}
          >
            <div className="mx-auto h-[clamp(1.9rem,3.4vw,2.8rem)] w-24 animate-pulse rounded-md bg-primary-foreground/18" />
            <div className="mx-auto mt-2 h-4 w-28 animate-pulse rounded bg-primary-foreground/14" />
          </div>
        ))}
      </div>
    </div>
  );
}
