import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function PropertyCardHomeSkeleton() {
  return (
    <Card className="w-full max-w-sm overflow-hidden rounded-xl border border-border bg-card p-0 shadow-sm">
      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
        <Skeleton className="absolute inset-0 rounded-none" />

        <div className="absolute left-2.5 top-2.5 z-10">
          <Skeleton className="h-5 w-18 rounded-md bg-foreground/10" />
        </div>
        <div className="absolute bottom-2.5 left-2.5 z-10">
          <Skeleton className="h-5 w-22 rounded-md bg-foreground/10" />
        </div>
      </div>

      <div className="space-y-2.5 p-3">
        <div className="space-y-1">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-3.5 w-4/5" />
          <Skeleton className="h-3.5 w-2/3" />
        </div>
        <Skeleton className="h-8 w-full rounded-none" />
        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-9 w-full rounded-lg" />
          <Skeleton className="h-9 w-full rounded-lg" />
        </div>
      </div>
    </Card>
  );
}

export function PropertyCardHomeSkeletons({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <PropertyCardHomeSkeleton key={index} />
      ))}
    </div>
  );
}
