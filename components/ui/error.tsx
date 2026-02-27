import Link from 'next/link';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ErrorProps {
  title?: string;
  description?: string;
  className?: string;
  onRetry?: () => void;
}

export function ErrorComponent({ title = 'Something Went Wrong', description = 'An unexpected error occurred. Please try again or contact support if it persists.', className, onRetry }: ErrorProps) {
  return (
    <div className={cn('flex min-h-[calc(100vh-5.0625rem)] flex-col items-center justify-center px-4 py-16', className)}>
      <div className="flex flex-col items-center gap-6 text-center">
        {/* Error Icon */}
        <span className="text-8xl font-bold text-muted-foreground/30 select-none">!</span>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>

        {/* Description */}
        <p className="max-w-md text-muted-foreground">{description}</p>

        {/* Actions */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          {onRetry && (
            <Button className="h-12 rounded-lg bg-primary px-8 text-sm font-semibold text-primary-foreground hover:bg-primary/90" onClick={onRetry}>
              Try Again
            </Button>
          )}
          <Button className="h-12 rounded-lg px-8 text-sm font-semibold" variant="outline" asChild>
            <Link href="/">Go to Homepage</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
