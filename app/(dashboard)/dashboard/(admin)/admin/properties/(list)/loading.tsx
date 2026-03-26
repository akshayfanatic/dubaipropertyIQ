import { Skeleton } from '@/components/ui/skeleton';
import { TableSkeleton } from '@/components/ui/table-skeleton';

export default function PropertiesLoading() {
  return (
    <div className="space-y-6">
      {/* TopBar */}
      <div className="flex items-center justify-between">
        {/* Left side (title + subtitle) */}
        <div className="space-y-2">
          <Skeleton className="h-6 w-40" /> {/* Title */}
          <Skeleton className="h-4 w-64" /> {/* Subtitle */}
        </div>

        {/* Right side (button) */}
        <Skeleton className="h-10 w-32 rounded-md" />
      </div>
      {/* Filter Bar Skeleton */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-full sm:w-40" />
        <Skeleton className="h-10 w-full sm:w-40" />
        <Skeleton className="h-10 w-24" />
      </div>

      {/* Properties Grid Skeleton */}
      <TableSkeleton />
    </div>
  );
}
