import { User } from 'lucide-react';

import { WidgetCard } from '@/components/shared/WidgetCard';
import { Skeleton } from '@/components/ui/skeleton';

export default function CustomerProfileLoading() {
  return (
    <WidgetCard icon={User} title="Profile Information" description="Update your personal details.">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-4 w-32" />
          <div className="rounded-xl border border-dashed border-border/60 bg-muted/30 p-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-52" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-11 w-full rounded-lg" />
        </div>

        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-11 w-full rounded-lg" />
          <Skeleton className="h-3 w-64" />
        </div>

        <div className="flex justify-end">
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>
      </div>
    </WidgetCard>
  );
}
