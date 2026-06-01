'use client';

import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface SectionCardProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  navigation?: ReactNode;
  align?: 'left' | 'center';
  classes?: {
    eyebrow?: string;
    title?: string;
    description?: string;
    wrapper?: string;
  };
}

export function SectionCard({ eyebrow, title, description, children, className, contentClassName, navigation, align = 'left', classes }: SectionCardProps) {
  const hasHeader = eyebrow || title || description;
  const isCentered = align === 'center' && !navigation;

  return (
    <section className={cn('px-0 py-[clamp(3.5rem,7vw,6.5rem)]', className)}>
      <div className="mx-auto w-[min(92%,1440px)]">
        {hasHeader && (
          <div
            className={cn(
              'mb-[clamp(2rem,4vw,3rem)] flex flex-col gap-4',
              navigation ? 'items-start justify-between md:flex-row md:items-end' : isCentered ? 'items-center text-center' : 'items-start text-left',
              classes?.wrapper,
            )}
          >
            <div className={cn('max-w-[640px]', isCentered && 'mx-auto')}>
              {eyebrow && (
                <span
                  className={cn(
                    'inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-primary',
                    !isCentered && 'before:h-0.5 before:w-5.5 before:rounded-full before:bg-primary before:content-[""]',
                    classes?.eyebrow,
                  )}
                >
                  {eyebrow}
                </span>
              )}

              {title && <h2 className={cn('mt-3 text-[clamp(1.9rem,3.6vw,2.9rem)] font-extrabold leading-[1.12] tracking-normal text-foreground', !eyebrow && 'mt-0', classes?.title)}>{title}</h2>}

              {description && <p className={cn('mt-3 text-base leading-7 text-muted-foreground sm:text-[1.05rem]', classes?.description)}>{description}</p>}
            </div>

            {navigation && (
              <div className="shrink-0 [&_button]:size-11 [&_button]:rounded-full [&_button]:border [&_button]:border-border [&_button]:bg-background [&_button]:shadow-sm [&_button]:transition-all [&_button:hover]:-translate-y-0.5 [&_button:hover]:border-primary/40 [&_button:hover]:bg-primary [&_button:hover]:text-primary-foreground">
                {navigation}
              </div>
            )}
          </div>
        )}

        <div className={cn(!hasHeader && 'pt-0', contentClassName)}>{children}</div>
      </div>
    </section>
  );
}
