import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type MetricTone = 'positive' | 'neutral' | 'warning' | 'danger';

type BuildingMetricItem = {
  label: string;
  value: ReactNode;
  badge?: string;
  tone?: MetricTone;
};

type BuildingMetricCardProps = {
  items: BuildingMetricItem[];
};

const badgeToneClasses: Record<MetricTone, string> = {
  positive: 'bg-[oklch(0.88_0.12_151.5)] text-[oklch(0.34_0.13_151.5)]',
  neutral: 'bg-[oklch(0.92_0.015_260.47)] text-[oklch(0.38_0.03_260.47)]',
  warning: 'bg-[oklch(0.88_0.095_69.5)] text-[oklch(0.43_0.09_69.5)]',
  danger: 'bg-[oklch(0.88_0.09_17.5)] text-[oklch(0.46_0.13_17.5)]',
};

// Grouped metric strip for compact building facts with internal dividers.
export function BuildingMetricCard({ items }: BuildingMetricCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_10px_28px_oklch(0.22_0.03_260.47/0.08)]">
      <div className="grid divide-y divide-border sm:grid-cols-2 sm:divide-x sm:divide-y-0 xl:grid-cols-4">
        {items.map((item) => (
          <div key={item.label} className="px-6 py-5">
            <p className="text-sm font-extrabold leading-5 text-foreground">{item.label}</p>
            <div className="mt-2 flex min-h-7 flex-wrap items-center gap-2">
              <span className="text-[0.95rem] font-medium leading-6 text-foreground">{item.value}</span>
              {item.badge && <span className={cn('rounded-full px-2.5 py-1 text-xs font-extrabold leading-none', badgeToneClasses[item.tone ?? 'neutral'])}>{item.badge}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
