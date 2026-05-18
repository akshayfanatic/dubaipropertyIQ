import { Card } from '@/components/ui/card';
import { Star, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DeveloperTrustBadgeProps {
  trustScore: number;
  className?: string;
}

export function DeveloperTrustBadge({ trustScore, className }: DeveloperTrustBadgeProps) {
  return (
    <Card
      className={cn(
        'relative overflow-hidden p-8 flex flex-col items-center justify-center text-center border border-border/50 bg-background/50 backdrop-blur-xl shadow-2xl shadow-primary/5',
        className,
      )}
    >
      {/* Glossy overlay effect */}
      <div className="absolute inset-0 bg-linear-to-tr from-primary/5 via-transparent to-transparent pointer-events-none" />

      <div className="absolute top-0 right-0 p-6 opacity-5">
        <ShieldCheck className="w-32 h-32 text-primary" />
      </div>

      <div className="relative mb-8 group">
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-700" />
        <svg className="w-36 h-36 transform -rotate-90 relative">
          <circle cx="72" cy="72" r="64" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-muted/10" />
          <circle
            cx="72"
            cy="72"
            r="64"
            stroke="currentColor"
            strokeWidth="10"
            fill="transparent"
            strokeDasharray={402.1}
            strokeDashoffset={402.1 - (402.1 * trustScore) / 100}
            strokeLinecap="round"
            className="text-primary transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-black text-foreground tracking-tighter">{trustScore}</span>
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-1">Score</span>
        </div>
      </div>

      <div className="relative z-10">
        <h3 className="text-xs font-black text-foreground uppercase tracking-[0.3em] mb-3 opacity-80">Trust Index</h3>

        <div className="flex gap-2 justify-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <div key={star} className="relative">
              {star <= Math.round(trustScore / 20) && <div className="absolute inset-0 bg-yellow-400/40 blur-md rounded-full scale-150 animate-pulse" />}
              <Star className={cn('w-5 h-5 relative transition-all duration-500', star <= Math.round(trustScore / 20) ? 'fill-yellow-400 text-yellow-400' : 'fill-muted/20 text-muted/20')} />
            </div>
          ))}
        </div>

        <div className="mt-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
          <ShieldCheck className="w-3 h-3 text-primary" />
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Verified Developer</span>
        </div>
      </div>
    </Card>
  );
}
