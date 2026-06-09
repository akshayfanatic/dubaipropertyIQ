import { PlusCircle } from 'lucide-react';
import { serverClient } from '@/lib/supabase/server';
import { Stats } from '@/components/dashboard/admin/dashboard/Stats';
import { QuickActions } from '@/components/dashboard/admin/dashboard/QuickActions';
import { RecentProperties } from '@/components/dashboard/admin/dashboard/RecentProperties';
import { adminRoutes } from '@/config/routes';
import { Suspense } from 'react';
import { QuickAction } from '@/types/dashboard';

export default async function DashboardPage() {
  const supabase = await serverClient();

  // Quick Actions - Add Property + first 4 Management routes from config/routes.ts
  const managementItems = adminRoutes.find((g) => g.title === 'Management')?.items || [];

  const quickActions: QuickAction[] = [
    {
      title: 'Add Property',
      description: 'Create a new property listing',
      href: '/dashboard/admin/properties/new',
      icon: PlusCircle,
    },
    ...managementItems.slice(0, 4).map((item) => ({
      title: item.title,
      description: `Manage ${item.title.toLowerCase()}`,
      href: item.href,
      icon: item.icon,
    })),
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid - Suspense boundary for independent loading */}
      <Suspense fallback={<Stats.Skeleton />}>
        <Stats />
      </Suspense>

      {/* Quick Actions */}
      <QuickActions actions={quickActions} />

      {/* Recent Properties - Suspense boundary for independent loading */}
      <Suspense fallback={<RecentProperties.Skeleton />}>
        <RecentProperties />
      </Suspense>
    </div>
  );
}
