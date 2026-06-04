// components/dashboard/admin/dashboard/RecentProperties.tsx

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronRight } from 'lucide-react';
import { getRecentPropertiesAdmin } from '@/lib/db/dashboard/queries';
import { cn } from '@/lib/utils';

export interface RecentProperty {
  id: string;
  title: string;
  slug: string;
}

interface RecentPropertiesProps {
  properties?: RecentProperty[];
  className?: string;
}

async function RecentProperties({ className }: RecentPropertiesProps) {
  const result = await getRecentPropertiesAdmin();
  const properties = result.success ? (result.data ?? []) : [];
  const hasLoadError = !result.success;

  const emptyMessage = hasLoadError ? 'Recent properties could not be loaded.' : 'No recent properties yet.';

  return (
    <Card className={cn('gap-0 rounded-xl border border-border bg-card p-0 shadow-sm', className)}>
      <CardHeader className="border-b border-border px-5 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-primary">Recently updated</p>
            <CardTitle className="mt-1 text-lg font-extrabold text-foreground">Recent properties</CardTitle>
            <p className="mt-1 text-xs font-medium text-muted-foreground">Latest listings touched by the admin team.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-bold text-muted-foreground">{properties.length} latest</span>
            <Link
              href="/dashboard/admin/properties"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-xs font-extrabold text-foreground transition-colors hover:border-primary/40 hover:bg-accent hover:text-primary focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/35"
            >
              View all
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-3 py-3">
        {properties.length === 0 && (
          <div className="rounded-xl border border-dashed border-border bg-background px-4 py-5">
            <p className="text-sm font-extrabold text-foreground">{emptyMessage}</p>
            <p className="mt-1 text-xs font-medium leading-5 text-muted-foreground">Published or edited listings will appear here for quick review.</p>
          </div>
        )}
        <div className="divide-y divide-border">
          {properties.map((property, index) => (
            <Link
              key={property.id}
              href={`/dashboard/admin/properties/${property.id}`}
              className="group flex min-h-14 items-center gap-3 rounded-lg px-3 py-3 outline-none transition-colors hover:bg-accent/45 focus-visible:ring-[3px] focus-visible:ring-ring/35"
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-muted text-xs font-extrabold text-muted-foreground tabular-nums transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-extrabold text-foreground transition-colors group-hover:text-primary">{property.title || 'Untitled property'}</span>
                <span className="mt-0.5 block truncate text-xs font-medium text-muted-foreground">/{property.slug || property.id}</span>
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/60 transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

RecentProperties.Skeleton = function RecentPropertiesSkeleton() {
  return (
    <Card className="gap-0 rounded-xl border border-border bg-card p-0 shadow-sm">
      <CardHeader className="border-b border-border px-5 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Skeleton className="h-3 w-28" />
            <Skeleton className="mt-2 h-5 w-40" />
            <Skeleton className="mt-2 h-3 w-56 max-w-full" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-7 w-16 rounded-full" />
            <Skeleton className="h-9 w-20 rounded-lg" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-3 py-3">
        <div className="divide-y divide-border">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex min-h-14 items-center gap-3 px-3 py-3">
              <Skeleton className="size-8 rounded-lg" />
              <div className="min-w-0 flex-1">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="mt-2 h-3 w-1/3" />
              </div>
              <Skeleton className="h-4 w-4" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export { RecentProperties };
