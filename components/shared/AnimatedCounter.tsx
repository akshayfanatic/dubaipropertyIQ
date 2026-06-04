'use client';

import { useEffect, useRef, useState } from 'react';

type AnimatedCounterProps = {
  value: number;
  prefix?: string;
  suffix?: string;
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  duration?: number;
};

// Count-up number display that starts when it enters the viewport.
export function AnimatedCounter({ value, prefix, suffix, locale = 'en-AE', minimumFractionDigits = 0, maximumFractionDigits = 0, duration = 1200 }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let frameId: number | undefined;
    const setFinalValue = () => {
      frameId = requestAnimationFrame(() => setDisplayValue(value));
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setFinalValue();
      return () => {
        if (frameId) cancelAnimationFrame(frameId);
      };
    }

    const runCount = () => {
      const start = performance.now();

      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        setDisplayValue(value * eased);

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
      { threshold: 0.35 },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [duration, locale, maximumFractionDigits, minimumFractionDigits, value]);

  const formatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits,
    maximumFractionDigits,
  });

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {prefix ? ' ' : ''}
      {formatter.format(displayValue)}
      {suffix ? ` ${suffix}` : ''}
    </span>
  );
}
