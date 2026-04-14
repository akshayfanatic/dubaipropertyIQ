// components/dashboard/admin/dashboard/QuickActions.tsx

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { QuickAction } from '@/types/dashboard';

interface QuickActionsProps {
  actions: QuickAction[];
  className?: string;
}

export function QuickActions({ actions, className }: QuickActionsProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <h2 className="text-lg font-semibold">Quick Actions</h2>
      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.href} href={action.href}>
              <Card className="group cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/30">
                <CardContent className="flex flex-col items-center justify-center gap-2 p-4 text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-primary to-primary/70 text-white shadow-md shadow-primary/20 group-hover:scale-110 transition-transform">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-medium text-sm group-hover:text-primary transition-colors">{action.title}</span>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
