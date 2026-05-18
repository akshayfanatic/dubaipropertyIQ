import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export function PropertyGallerySkeleton() {
  return (
    <div className="relative aspect-16/10 md:aspect-21/9 rounded-2xl overflow-hidden shadow-lg animate-pulse">
      <div className="grid grid-cols-3 grid-rows-2 gap-2 h-full">
        {/* LARGE MAIN IMAGE SKELETON */}
        <div className="col-span-3 md:col-span-2 row-span-2 relative h-full bg-gray-200" />
        {/* SECONDARY IMAGES SKELETON */}
        <div className="hidden md:block relative h-full bg-gray-200" />
        <div className="hidden md:block relative h-full bg-gray-200" />
      </div>
    </div>
  );
}

export const SideBarContentSkeleton = () => {
  return (
    <Card className="max-w-full w-full border-none shadow-xl relative overflow-hidden rounded-2xl bg-card">
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-primary/20" />
      <CardContent className="p-6 space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-12 w-full" />

        <div className="pt-6 border-t space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-24" />
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export function PropertyInfoSkeleton() {
  return (
    <Card className="border border-border/50 shadow-2xl rounded-2xl bg-card/50 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
          <div className="flex-1 space-y-3">
            <Skeleton className="h-10 w-3/4" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <div className="sm:text-right space-y-2">
            <Skeleton className="h-10 w-40 sm:ml-auto" />
            <Skeleton className="h-4 w-24 sm:ml-auto" />
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        <div className="pt-4 space-y-4">
          <Skeleton className="h-6 w-48" />
          <div className="grid sm:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export const PropertyAttributesSkeleton = () => {
  return (
    <div className="flex flex-wrap items-center gap-y-6 gap-x-8 sm:gap-x-12 py-4 px-2 animate-pulse">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const PropertyAmenitiesSkeleton = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-4 gap-x-6 py-2 animate-pulse">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center gap-2.5">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
      ))}
    </div>
  );
};

export function DeveloperInfoSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-4 py-2 animate-pulse">
      <div className="flex items-center gap-4">
        <Skeleton className="w-20 h-20 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <Skeleton className="h-10 w-full sm:w-32 rounded-xl" />
    </div>
  );
}
