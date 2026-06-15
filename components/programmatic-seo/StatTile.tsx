import type { LucideIcon } from 'lucide-react';

type StatTileProps = {
  icon: LucideIcon;
  label: string;
  value: string;
};

export function StatTile({ icon: Icon, label, value }: StatTileProps) {
  return (
    <div className="min-h-24 rounded-2xl border border-border bg-background p-4">
      <Icon className="size-4 text-primary" />
      <p className="mt-3 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-extrabold leading-6 text-foreground">{value}</p>
    </div>
  );
}
