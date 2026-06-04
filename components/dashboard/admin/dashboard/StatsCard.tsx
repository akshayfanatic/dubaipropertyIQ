// components/dashboard/admin/dashboard/StatsCard.tsx

import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatSize } from '@/lib/utils/price';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const toneByTitle: Record<string, string> = {
  Properties: 'bg-primary/10 text-primary',
  Areas: 'bg-[oklch(0.92_0.055_176)] text-[oklch(0.38_0.09_176)] dark:bg-[oklch(0.31_0.05_176)] dark:text-[oklch(0.82_0.08_176)]',
  Developers: 'bg-[oklch(0.93_0.06_78)] text-[oklch(0.45_0.09_78)] dark:bg-[oklch(0.32_0.05_78)] dark:text-[oklch(0.84_0.09_78)]',
  Users: 'bg-muted text-muted-foreground',
};

export function StatsCard({ title, value, icon: Icon, trend, className }: StatsCardProps) {
  const toneClassName = toneByTitle[title] ?? 'bg-primary/10 text-primary';
  const formattedValue = typeof value === 'number' && Number.isFinite(value) ? formatSize(Math.max(0, value)) : value;

  return (
    <div
      className={cn(
        'group rounded-xl border border-border bg-card p-4 shadow-sm transition-[border-color,background-color,box-shadow] duration-200 hover:border-primary/35 hover:bg-accent/35 hover:shadow-md',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-xs font-extrabold uppercase tracking-[0.12em] text-muted-foreground">{title}</p>
          <div className="mt-3 flex flex-wrap items-baseline gap-2">
            <p className="max-w-full truncate text-[2rem] font-extrabold leading-none tracking-tight text-foreground tabular-nums">{formattedValue}</p>
            {trend && (
              <span
                className={cn(
                  'rounded-full px-2 py-1 text-xs font-extrabold',
                  trend.isPositive ? 'bg-[oklch(0.92_0.08_151)] text-[oklch(0.38_0.12_151)]' : 'bg-[oklch(0.92_0.075_24)] text-[oklch(0.46_0.12_24)]',
                )}
              >
                {trend.isPositive ? '+' : ''}
                {Number.isFinite(trend.value) ? trend.value : 0}%
              </span>
            )}
          </div>
          <p className="mt-3 text-xs font-medium text-muted-foreground">Current total</p>
        </div>
        <span className={cn('grid size-11 shrink-0 place-items-center rounded-lg transition-transform duration-200 group-hover:-translate-y-0.5', toneClassName)}>
          <Icon className="size-5" />
        </span>
      </div>
    </div>
  );
}
