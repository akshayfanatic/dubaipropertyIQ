import { Card } from '@/components/ui/card';

export default function Loading() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <DeveloperPropertyCardSkeleton key={index} />
      ))}
    </div>
  );
}

function DeveloperPropertyCardSkeleton() {
  return (
    <Card className="relative aspect-4/3 overflow-hidden rounded-xl border border-border bg-muted shadow-lg">
      <div className="absolute inset-0 animate-pulse bg-muted" />
      <div className="absolute inset-x-0 bottom-0 h-3/4 bg-linear-to-t from-foreground/20 via-foreground/10 to-transparent" />

      <div className="absolute left-3 top-3 z-10">
        <div className="h-6 w-24 animate-pulse rounded-lg bg-background/70" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="mb-3 space-y-2.5">
          <div className="mb-2 h-13 w-40 animate-pulse rounded-md bg-background/70" />
          <div className="h-6 w-4/5 animate-pulse rounded bg-background/70" />
          <div className="h-4 w-3/5 animate-pulse rounded bg-background/60" />
          <div className="h-7 w-1/2 animate-pulse rounded bg-background/70" />
          <div className="h-8 w-44 animate-pulse rounded-lg bg-background/50" />
        </div>

        <div className="mb-3 h-px bg-background/40" />
        <div className="h-11 w-full animate-pulse rounded-lg bg-background/70" />
      </div>
    </Card>
  );
}
