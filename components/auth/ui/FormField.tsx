import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  /** Label text */
  label: string;
  /** Input id (for accessibility) */
  htmlFor: string;
  /** The input element */
  children: ReactNode;
  /** Error message to display */
  error?: string;
  /** Optional element on the right side of label row (e.g., "Forgot password?" link) */
  labelRight?: ReactNode;
  /** Additional wrapper class */
  className?: string;
}

/**
 * Reusable form field wrapper with label and error display.
 * Reduces boilerplate in auth forms.
 */
export function FormField({ label, htmlFor, children, error, labelRight, className }: FormFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <div className={cn('flex items-center', labelRight ? 'justify-between' : '')}>
        <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
          {label}
        </label>
        {labelRight}
      </div>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
