import type { ComponentType } from 'react';

interface BuildingMetricTileProps {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
}

// Compact metric block for high-signal building facts such as yield, units, and service charge.
export function BuildingMetricTile({ icon: Icon, label, value }: BuildingMetricTileProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-muted-foreground">
        <Icon className="h-4 w-4 text-primary" />
        {label}
      </div>
      <p className="text-lg font-extrabold leading-tight text-foreground">{value}</p>
    </div>
  );
}
