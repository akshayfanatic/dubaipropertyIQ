import { cn } from '@/lib/utils';

interface DetailFieldProps {
  label: string;
  value?: string | number | null;
  className?: string;
}

export function DetailField({ label, value, className }: DetailFieldProps) {
  return (
    <div className={cn('space-y-1 rounded-lg border bg-card p-4', className)}>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="break-words text-sm font-medium text-foreground">{value ?? '-'}</p>
    </div>
  );
}
