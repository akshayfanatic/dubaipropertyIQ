import { Skeleton } from '@/components/ui/skeleton';

export function PropertyCardTileSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border bg-card p-0 shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-[18rem_minmax(0,1fr)] xl:grid-cols-[20rem_minmax(0,1fr)]">
        <div className="relative min-h-64 overflow-hidden bg-muted/50 lg:min-h-full">
          <Skeleton className="absolute inset-0 rounded-none" />
          <Skeleton className="absolute top-3 left-3 h-7 w-20 rounded-lg bg-foreground/10" />
          <Skeleton className="absolute bottom-3 left-3 h-6 w-24 rounded-md bg-foreground/10" />
        </div>
        <div className="flex min-w-0 flex-col justify-between gap-4 p-4 sm:p-5">
          <div className="space-y-3.5">
            <div className="space-y-2">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-6 w-4/5" />
              <div className="flex items-center gap-1.5">
                <Skeleton className="h-4 w-4 shrink-0 rounded-full" />
                <Skeleton className="h-4 w-44" />
              </div>
            </div>
            <Skeleton className="h-11 w-full rounded-none" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-11 w-full rounded-lg" />
            <Skeleton className="h-11 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function PropertyCardTilesSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <PropertyCardTileSkeleton key={index} />
      ))}
    </div>
  );
}
