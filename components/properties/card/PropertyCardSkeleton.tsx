import { Skeleton } from '@/components/ui/skeleton';

export function PropertyCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border bg-card p-0 shadow-md">
      <div className="grid min-h-72 grid-cols-1 md:grid-cols-[20rem_minmax(0,1fr)]">
        <div className="relative min-h-64 overflow-hidden bg-muted/50 md:min-h-full">
          <Skeleton className="absolute inset-0 rounded-none" />
          <Skeleton className="absolute top-3 left-3 h-7 w-20 rounded-lg bg-foreground/10" />
        </div>
        <div className="flex min-w-0 flex-col justify-between gap-5 p-4 sm:p-5 lg:p-6">
          <div className="space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1 space-y-1.5">
                <Skeleton className="h-6 w-28" />
                <Skeleton className="h-6 w-4/5" />
              </div>
              <div className="flex items-center gap-1.5 sm:justify-end">
                <Skeleton className="h-4 w-4 shrink-0 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <Skeleton className="h-8 w-56 rounded-lg" />
          </div>
          <Skeleton className="h-11 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
