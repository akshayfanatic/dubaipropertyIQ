'use client';

import { Award, Star, ShieldCheck, CheckCircle2, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

export type GoldenVisaVariant = 'elegant' | 'outline' | 'glass' | 'gradient-soft' | 'premium-dark' | 'minimalist';

interface GoldenVisaBadgeProps {
  variant?: GoldenVisaVariant;
  className?: string;
  showIcon?: boolean;
}

export function GoldenVisaBadge({ variant = 'gradient-soft', className, showIcon = true }: GoldenVisaBadgeProps) {
  const variants = {
    elegant: 'bg-amber-50 text-amber-700 border-amber-200/60 shadow-xs',
    outline: 'bg-transparent text-amber-600 border-amber-300',
    glass: 'bg-amber-500/10 backdrop-blur-md text-amber-700 border-amber-500/20',
    'gradient-soft': 'bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 border-amber-200',
    'premium-dark': 'bg-amber-950 text-amber-200 border-amber-800',
    minimalist: 'bg-transparent text-amber-600 border-transparent p-0',
  };

  const icons = {
    elegant: Award,
    outline: ShieldCheck,
    glass: Star,
    'gradient-soft': Crown,
    'premium-dark': Award,
    minimalist: CheckCircle2,
  };

  const Icon = icons[variant] || Award;

  return (
    <div className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] font-semibold transition-all duration-300', variants[variant], className)}>
      {showIcon && <Icon className="h-3.5 w-3.5 shrink-0 text-amber-600" />}
      <span>Golden Visa Eligible</span>
    </div>
  );
}
