'use client';

import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { ReactNode } from 'react';

interface SectionCardProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  navigation?: ReactNode;
  classes?: {
    title?: string;
    description?: string;
    wrapper?: string;
  };
}

export function SectionCard({ title, description, children, className, contentClassName, navigation, classes }: SectionCardProps) {
  const hasHeader = title || description;

  return (
    <section className={cn('py-16 px-4 md:px-6', className)}>
      <div className="container mx-auto">
        <Card className="border-none shadow-none bg-transparent p-0 gap-2">
          {/* HEADER */}
          {hasHeader && (
            <CardHeader className="px-0 pb-4">
              <div className={cn('flex justify justify-between gap-4', classes?.wrapper)}>
                <div className="space-y-2 w-full">
                  {title && <CardTitle className={cn('text-2xl md:text-3xl', classes?.title)}>{title}</CardTitle>}

                  {description && <CardDescription className={cn('text-sm md:text-base', classes?.description)}>{description}</CardDescription>}
                </div>

                {navigation && <div className="shrink-0">{navigation}</div>}
              </div>
            </CardHeader>
          )}

          {/* CONTENT */}
          <CardContent className={cn('px-0', !hasHeader && 'pt-0', contentClassName)}>{children}</CardContent>
        </Card>
      </div>
    </section>
  );
}
Request;
