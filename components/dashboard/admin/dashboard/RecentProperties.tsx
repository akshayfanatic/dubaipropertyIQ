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

  if (properties.length === 0) {
    return null;
  }

  return (
    <Card className={cn('', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Recent Properties</CardTitle>
          <Link href="/dashboard/admin/properties" className="text-xs text-primary hover:underline flex items-center gap-1">
            View all
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-1">
          {properties.map((property, index) => (
            <Link key={property.id} href={`/dashboard/admin/properties/${property.id}`} className="group flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors">
              <span className="text-xs text-muted-foreground/50 font-mono w-5">{String(index + 1).padStart(2, '0')}</span>
              <span className="flex-1 text-sm text-foreground group-hover:text-primary transition-colors truncate">{property.title}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

RecentProperties.Skeleton = function RecentPropertiesSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-16" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2.5">
              <Skeleton className="h-4 w-5 font-mono" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 w-4" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export { RecentProperties };
