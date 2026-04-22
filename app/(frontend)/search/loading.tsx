import { Skeleton } from '@/components/ui/skeleton';
import { WidgetCard } from '@/components/shared/WidgetCard';
import { PropertyCardSkeleton } from '@/components/properties/card';

export default function SearchLoading() {
  return (
    <div className="min-h-screen">
      {/* Header Filters */}
      <div className="bg-background sticky top-0 z-10">
        <WidgetCard className="max-w-295 mx-auto" contentClassNames="p-0 gap-4 p-4 px-8 space-y-4">
          <Skeleton className="h-9 w-80" />
          <div className="flex flex-wrap gap-3 w-full">
            <Skeleton className="flex-1 min-w-48 max-w-sm h-10 rounded-md" />
            <Skeleton className="w-full max-w-sm h-10 rounded-md" />
            <Skeleton className="w-48 h-10 rounded-md" />
          </div>
        </WidgetCard>
      </div>

      <div className="max-w-295 mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <WidgetCard className="max-w-xs w-full shrink-0 max-h-fit">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center gap-3 pb-2 border-b">
                <Skeleton className="h-9 w-9 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
              {/* Amenities */}
              <Skeleton className="h-10 w-full rounded-md" />
              {/* Golden Visa */}
              <Skeleton className="h-16 w-full rounded-lg" />
            </div>
          </WidgetCard>

          {/* Main Content - Property Cards */}
          <main className="flex-1">
            <div className="grid grid-cols-1 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <PropertyCardSkeleton key={i} />
              ))}
            </div>
            {/* Pagination Skeleton */}
            <div className="flex justify-center items-center gap-2 pt-8">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <Skeleton className="h-9 w-9 rounded-lg" />
              <Skeleton className="h-9 w-9 rounded-lg" />
              <Skeleton className="h-9 w-9 rounded-lg" />
              <Skeleton className="h-9 w-9 rounded-lg" />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
