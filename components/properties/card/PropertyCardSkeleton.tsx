import { Skeleton } from '@/components/ui/skeleton';

export function PropertyCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <div className="flex flex-col sm:flex-row">
        <div className="sm:w-72 sm:shrink-0 aspect-4/3 sm:aspect-auto bg-muted/50 relative">
          <Skeleton className="absolute inset-0 rounded-none" />
          <Skeleton className="absolute top-3 left-3 h-6 w-20 rounded-full" />
        </div>
        <div className="flex-1 flex flex-col p-6 mt-4">
          <div className="p-0 gap-2 mb-4">
            <div className="flex items-start justify-evenly gap-4">
              <div className="flex-1 min-w-0 space-y-1.5">
                <Skeleton className="h-6 w-28" />
                <Skeleton className="h-6 w-3/4" />
              </div>
              <div className="flex items-center gap-1.5">
                <Skeleton className="h-4 w-4 shrink-0 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <div className="space-y-2 pt-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-6" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-6" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
