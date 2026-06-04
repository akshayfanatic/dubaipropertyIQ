// components/dashboard/admin/dashboard/Stats.tsx

import { MapPin, Users, Home, Building } from 'lucide-react';
import { getDashboardStatsAdmin } from '@/lib/db/dashboard/queries';
import { StatsCard } from './StatsCard';
import { Skeleton } from '@/components/ui/skeleton';

async function Stats() {
  const statsResult = await getDashboardStatsAdmin();
  const stats = statsResult.success ? statsResult.data : null;

  if (!stats) {
    return (
      <div className="space-y-3">
        <div className="rounded-xl border border-border bg-muted/45 px-4 py-3 text-sm font-medium text-muted-foreground">Dashboard totals are unavailable right now.</div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard title="Properties" value="0" icon={Home} />
          <StatsCard title="Areas" value="0" icon={MapPin} />
          <StatsCard title="Developers" value="0" icon={Building} />
          <StatsCard title="Users" value="0" icon={Users} />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <StatsCard title="Properties" value={stats.properties} icon={Home} />
      <StatsCard title="Areas" value={stats.areas} icon={MapPin} />
      <StatsCard title="Developers" value={stats.developers} icon={Building} />
      <StatsCard title="Users" value={stats.users} icon={Users} />
    </div>
  );
}

Stats.Skeleton = function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1 space-y-3">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="size-11 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
};

export { Stats };
