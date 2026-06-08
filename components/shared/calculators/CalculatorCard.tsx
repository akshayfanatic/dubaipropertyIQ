import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CalculatorCardProps {
  title: string;
  description?: string;
  value?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  interactive?: boolean;
}

export function CalculatorCard({ title, description, value, children, footer, className, interactive = false }: CalculatorCardProps) {
  return (
    <div className={cn('rounded-2xl border border-border bg-card p-6', interactive && 'transition-all duration-300 hover:shadow-lg hover:shadow-primary/5', className)}>
      <div className={cn(value && 'mb-4')}>
        <label className="block font-semibold text-foreground">{title}</label>
        {description && <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>}
      </div>
      {value && <div className="mb-4">{value}</div>}
      {children}
      {footer && <div className="mt-3">{footer}</div>}
    </div>
  );
}

interface CalculatorFieldProps {
  label: string;
  children: ReactNode;
}

export function CalculatorField({ label, children }: CalculatorFieldProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-foreground">{label}</label>
      {children}
    </div>
  );
}
