import PageLayout from '@/components/layout/PageLayout';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export default function DevelopersLoading() {
  return (
    <PageLayout contentFullWidth>
      {/* Developer hero/banner skeleton with profile card placeholder */}
      <section className="relative flex h-112 w-full items-center overflow-hidden bg-muted">
        <div className="absolute inset-0 bg-linear-to-br from-muted via-muted/80 to-background" />
        <div className="relative z-10 container mx-auto px-4 sm:px-16">
          <Card className="w-full max-w-sm rounded-[2.5rem] border-white/20 bg-background/70 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.12)] backdrop-blur-xl">
            <div className="flex h-full flex-col justify-between">
              <div>
                <Skeleton className="mb-8 h-24 w-24 rounded-3xl bg-background" />
                <div className="mb-8 space-y-4">
                  <Skeleton className="h-8 w-56 bg-background" />
                  <Skeleton className="h-4 w-full bg-background" />
                  <Skeleton className="h-4 w-5/6 bg-background" />
                  <Skeleton className="h-4 w-2/3 bg-background" />
                </div>
              </div>
              <div className="space-y-5 border-t border-border pt-6">
                <Skeleton className="h-3 w-36 bg-background" />
                <div className="grid grid-cols-2 gap-3">
                  <Skeleton className="h-12 rounded-2xl bg-background" />
                  <Skeleton className="h-12 rounded-2xl bg-background" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Developer overview stats skeleton */}
      <section className="px-4 py-16 md:px-6">
        <div className="container mx-auto space-y-6">
          <Skeleton className="h-9 w-72" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="border-border/50 p-6">
                <Skeleton className="mb-4 h-12 w-12 rounded-2xl" />
                <Skeleton className="mb-3 h-8 w-20" />
                <Skeleton className="h-4 w-28" />
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Developer properties filter and card grid skeleton */}
      <section className="px-4 py-16 md:px-6">
        <div className="container mx-auto space-y-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Skeleton className="h-9 w-80 max-w-full" />
            <Skeleton className="h-10 w-64 max-w-full rounded-lg" />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <PropertySkeleton key={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Developer enquiry form skeleton */}
      <section className="px-4 py-16 md:px-6">
        <div className="container mx-auto space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-9 w-72" />
            <Skeleton className="h-5 w-96 max-w-full" />
          </div>
          <Card className="space-y-4 border-border/50 p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Skeleton className="h-12 rounded-lg" />
              <Skeleton className="h-12 rounded-lg" />
            </div>
            <Skeleton className="h-28 rounded-lg" />
            <Skeleton className="h-12 w-40 rounded-lg" />
          </Card>
        </div>
      </section>
    </PageLayout>
  );
}

function PropertySkeleton() {
  return (
    // Property card skeleton used inside the developer properties grid.
    <Card className="relative aspect-4/3 overflow-hidden rounded-xl border border-border shadow-lg">
      <Skeleton className="absolute inset-0 rounded-none" />
      <div className="absolute inset-x-0 bottom-0 h-3/4 bg-linear-to-t from-background/70 via-background/40 to-transparent" />
      <div className="absolute left-3 top-3">
        <Skeleton className="h-6 w-24 rounded-lg bg-background/80" />
      </div>
      <div className="absolute inset-x-0 bottom-0 space-y-3 p-4">
        <Skeleton className="h-9 w-36 bg-background/80" />
        <Skeleton className="h-6 w-4/5 bg-background/80" />
        <Skeleton className="h-4 w-3/5 bg-background/70" />
        <Skeleton className="h-7 w-1/2 bg-background/80" />
        <Skeleton className="h-10 w-full bg-background/80" />
      </div>
    </Card>
  );
}
