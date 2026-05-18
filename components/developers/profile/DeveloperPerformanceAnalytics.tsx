import { Card } from '@/components/ui/card';
import { Clock, Star, Wrench, Headphones, Activity } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PerformanceBreakdown {
  deliveryTimeliness: number;
  serviceChargeRating: number;
  buildQuality: number;
  afterSalesSupport: number;
}

interface DeveloperPerformanceAnalyticsProps {
  breakdown: PerformanceBreakdown;
  className?: string;
}

export function DeveloperPerformanceAnalytics({ breakdown, className }: DeveloperPerformanceAnalyticsProps) {
  return (
    <Card className={cn('p-8 border border-border/50 bg-background/50 backdrop-blur-xl shadow-2xl shadow-primary/5 relative overflow-hidden', className)}>
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <Activity className="w-48 h-48 text-primary" />
      </div>

      <div className="flex items-center justify-between mb-10 relative z-10">
        <div className="space-y-1">
          <h3 className="text-2xl font-black text-foreground tracking-tighter">Performance Analytics</h3>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-60">Verified Operational Excellence</p>
        </div>
        <div className="px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full">
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Real-time Data</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-10 relative z-10">
        <ScoreItem icon={Clock} label="Delivery Timeliness" value={breakdown.deliveryTimeliness} color="bg-blue-500" />
        <ScoreItem icon={Star} label="Service Charge Index" value={breakdown.serviceChargeRating} color="bg-purple-500" />
        <ScoreItem icon={Wrench} label="Build Quality Score" value={breakdown.buildQuality} color="bg-emerald-500" />
        <ScoreItem icon={Headphones} label="After-Sales Care" value={breakdown.afterSalesSupport} color="bg-orange-500" />
      </div>
    </Card>
  );
}

function ScoreItem({ icon: Icon, label, value, color }: { icon: LucideIcon; label: string; value: number; color: string }) {
  return (
    <div className="group space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-2.5 rounded-xl bg-background border border-border/50 group-hover:border-primary/50 group-hover:bg-primary/5 transition-all duration-500">
            <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <span className="text-sm font-bold text-foreground/80 group-hover:text-foreground transition-colors">{label}</span>
        </div>
        <div className="flex items-baseline gap-0.5">
          <span className="text-lg font-black text-foreground">{value}</span>
          <span className="text-[10px] font-bold text-muted-foreground">%</span>
        </div>
      </div>

      <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-muted/20 p-0.5">
        <div className={cn('h-full transition-all duration-1000 ease-out rounded-full relative group-hover:shadow-[0_0_15px_rgba(var(--primary),0.3)]', color)} style={{ width: `${value}%` }}>
          <div className="absolute inset-0 bg-white/20 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
