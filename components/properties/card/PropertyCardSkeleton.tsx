import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function PropertyCardSkeleton() {
  return (
    <Card className="h-[360px] w-full overflow-hidden rounded-xl border border-border bg-muted p-0 shadow-md sm:h-[380px] xl:h-[400px]">
      <div className="relative h-full w-full overflow-hidden bg-muted">
        <Skeleton className="absolute inset-0 rounded-none" />
        <div className="absolute inset-x-0 bottom-0 h-3/4 bg-linear-to-t from-foreground/30 to-transparent" />

        <div className="absolute left-3 top-3 z-10 space-y-1.5">
          <Skeleton className="h-5 w-16 rounded-md bg-foreground/10" />
          <Skeleton className="h-5 w-32 rounded-md bg-foreground/10" />
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 p-3">
          <div className="space-y-2.5">
            <Skeleton className="h-10 w-20 rounded-md bg-background/40" />
            <Skeleton className="h-7 w-3/4 bg-background/30" />
            <Skeleton className="h-4 w-4/5 bg-background/25" />
            <Skeleton className="h-5 w-2/3 bg-background/25" />
            <div className="space-y-1">
              <Skeleton className="h-3.5 w-20 bg-background/25" />
              <Skeleton className="h-7 w-36 bg-background/30" />
            </div>
            <Skeleton className="h-9 w-full rounded-lg bg-background/40" />
          </div>
        </div>
      </div>
    </Card>
  );
}

export function PropertyCardSkeletons({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <PropertyCardSkeleton key={index} />
      ))}
    </div>
  );
}
