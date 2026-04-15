import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SettingsCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  variant?: 'default' | 'destructive';
  children: React.ReactNode;
  className?: string;
}

export function SettingsCard({ icon: Icon, title, description, variant = 'default', children, className }: SettingsCardProps) {
  const isDestructive = variant === 'destructive';

  return (
    <div className={cn('rounded-xl border bg-card p-6 shadow-sm', isDestructive ? 'border-destructive/30' : 'border-border/60', className)}>
      <div className="mb-4 flex items-center gap-3">
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', isDestructive ? 'bg-destructive/10' : 'bg-primary/10')}>
          <Icon className={cn('h-5 w-5', isDestructive ? 'text-destructive' : 'text-primary')} />
        </div>
        <div>
          <h2 className={cn('text-lg font-semibold', isDestructive && 'text-destructive')}>{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
