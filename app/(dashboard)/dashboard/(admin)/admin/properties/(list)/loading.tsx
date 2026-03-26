import { Skeleton } from '@/components/ui/skeleton';
import { TableSkeleton } from '@/components/ui/table-skeleton';

export default function PropertiesLoading() {
  return (
    <div className="space-y-6">
      {/* PageHeader Skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-8 w-32" />
          </div>
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* FilterBar Skeleton */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Skeleton className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
          <Skeleton className="h-10 w-full pl-10" />
        </div>
        <Skeleton className="h-10 w-full sm:w-40" />
        <Skeleton className="h-10 w-full sm:w-40" />
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>

      {/* Table Skeleton */}
      <TableSkeleton columns={8} rows={10} />
    </div>
  );
}
