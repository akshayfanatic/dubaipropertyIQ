'use client';

import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { ReactNode } from 'react';

interface SectionCardProps {
  title?: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function SectionCard({ title, description, children, actions, className, contentClassName }: SectionCardProps) {
  const hasHeader = title || description;

  return (
    <Card className={cn('border-none shadow-none', className)}>
      {hasHeader && (
        <CardHeader className="text-start">
          <div className="space-y-2 sm:space-y-4">
            {title && <CardTitle className="text-2xl md:text-3xl">{title}</CardTitle>}
            {description && <CardDescription className="text-sm sm:text-base">{description}</CardDescription>}
          </div>
        </CardHeader>
      )}
      <CardContent className={cn(!hasHeader && 'pt-2 sm:pt-4', contentClassName)}>{children}</CardContent>
      {actions && <CardFooter className="justify-center pt-4">{actions}</CardFooter>}
    </Card>
  );
}
