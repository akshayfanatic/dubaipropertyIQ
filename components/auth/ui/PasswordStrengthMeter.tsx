'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface PasswordStrengthMeterProps {
  password: string;
  className?: string;
}

type StrengthLevel = 'weak' | 'medium' | 'strong' | 'very-strong';

function calculateStrength(password: string): {
  level: StrengthLevel;
  score: number;
} {
  if (!password) return { level: 'weak', score: 0 };

  let score = 0;

  // Length check
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;

  // Character variety
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;

  // Determine level
  let level: StrengthLevel;
  if (score <= 2) level = 'weak';
  else if (score <= 4) level = 'medium';
  else if (score <= 5) level = 'strong';
  else level = 'very-strong';

  return { level, score };
}

const strengthConfig: Record<StrengthLevel, { label: string; color: string; segments: number }> = {
  weak: { label: 'Weak', color: 'bg-destructive', segments: 1 },
  medium: { label: 'Medium', color: 'bg-amber-500', segments: 2 },
  strong: { label: 'Strong', color: 'bg-emerald-500', segments: 3 },
  'very-strong': {
    label: 'Very Strong',
    color: 'bg-emerald-600',
    segments: 4,
  },
};

export function PasswordStrengthMeter({ password, className }: PasswordStrengthMeterProps) {
  const { level, score } = React.useMemo(() => calculateStrength(password), [password]);

  if (!password) return null;

  const config = strengthConfig[level];

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex gap-1.5">
        {[1, 2, 3, 4].map((segment) => (
          <div key={segment} className={cn('h-1 flex-1 rounded-full transition-all duration-300', segment <= config.segments ? config.color : 'bg-muted-foreground/20')} />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Password strength: <span className={cn('font-medium', config.color.replace('bg-', 'text-'))}>{config.label}</span>
      </p>
    </div>
  );
}
