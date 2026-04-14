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
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Properties" value={0} icon={Home} />
        <StatsCard title="Areas" value={0} icon={MapPin} />
        <StatsCard title="Developers" value={0} icon={Building} />
        <StatsCard title="Users" value={0} icon={Users} />
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <StatsCard title="Properties" value={stats.properties} icon={Home} />
      <StatsCard title="Areas" value={stats.areas} icon={MapPin} />
      <StatsCard title="Developers" value={stats.developers} icon={Building} />
      <StatsCard title="Users" value={stats.users} icon={Users} />
    </div>
  );
}

Stats.Skeleton = function StatsSkeleton() {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="rounded-xl border border-border/60 bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export { Stats };
