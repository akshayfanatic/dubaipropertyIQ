import Link from 'next/link';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface NotFoundProps {
  title?: string;
  description?: string;
  className?: string;
}

export function NotFound({ title = 'Page Not Found', description = "The page you're looking for doesn't exist or has been moved.", className }: NotFoundProps) {
  return (
    <div className={cn('flex min-h-[calc(100vh-5.0625rem)] flex-col items-center justify-center px-4 py-16', className)}>
      <div className="flex flex-col items-center gap-6 text-center">
        {/* 404 Number */}
        <span className="text-8xl font-bold text-muted-foreground/30 select-none">404</span>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>

        {/* Description */}
        <p className="max-w-md text-muted-foreground">{description}</p>

        {/* CTA Button */}
        <Button className="mt-4 h-12 rounded-lg bg-primary px-8 text-sm font-semibold text-primary-foreground hover:bg-primary/90" asChild>
          <Link href="/">Go to Homepage</Link>
        </Button>
      </div>
    </div>
  );
}
