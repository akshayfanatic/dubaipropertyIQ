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
    <Card className={cn('border-none shadow-none', className)}>
      {hasHeader && (
        <CardHeader className="text-start">
          <div className={cn('flex items-start justify-between gap-4', classes?.wrapper)}>
            <div className="space-y-2 sm:space-y-4">
              {title && <CardTitle className={cn('text-2xl md:text-3xl', classes?.title)}>{title}</CardTitle>}
              {description && <CardDescription className={cn('text-sm sm:text-base', classes?.description)}>{description}</CardDescription>}
            </div>
            {navigation}
          </div>
        </CardHeader>
      )}
      <CardContent className={cn(!hasHeader && 'pt-2 sm:pt-4', contentClassName)}>{children}</CardContent>
    </Card>
  );
}
