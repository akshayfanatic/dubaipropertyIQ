import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function PropertyCardHomeSkeleton() {
  return (
    <Card className="relative overflow-hidden rounded-xl aspect-4/3 border border-border shadow-md">
      {/* Background */}
      <div className="absolute inset-0 bg-muted" />

      {/* Top Bar */}
      <div className="absolute top-3 left-3 z-10">
        <Skeleton className="h-6 w-16 rounded-md bg-foreground/10" />
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <Skeleton className="h-5 w-3/4 mb-2 bg-foreground/10" />
        <Skeleton className="h-6 w-24 mb-3 bg-foreground/10" />
        <Skeleton className="h-8 w-full rounded-lg bg-foreground/5" />
      </div>
    </Card>
  );
}
