import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface DeveloperKeyStatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  className?: string;
}

export function DeveloperKeyStatsCard({ label, value, icon: Icon, className }: DeveloperKeyStatsCardProps) {
  return (
    <Card className={cn('group relative overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 bg-background shadow-sm cursor-pointer card-entrance', className)}>
      <div className="absolute inset-0 bg-linear-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative p-5">
        <div className="flex items-center gap-4">
          {/* Icon Container with reusable wiggle utility */}
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ring-1 ring-border/50 bg-linear-to-br from-muted to-muted/50 group-hover:ring-primary/20 transition-all shadow-sm icon-wiggle-subtle">
            <Icon className="w-7 h-7 text-primary fill-primary group-hover:scale-110 transition-transform duration-500" strokeWidth={2} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-foreground tracking-tight group-hover:text-primary transition-colors leading-none mb-2">{value}</span>

              <div className="flex">
                {/* Standard Muted Pill Label */}
                <span className="inline-flex items-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-muted/50 px-2.5 py-1 rounded-full border border-border/50 group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                  {label}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
