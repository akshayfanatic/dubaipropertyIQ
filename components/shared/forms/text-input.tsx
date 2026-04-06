'use client';

import * as React from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  required?: boolean;
  error?: string;
}

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(({ className, label, required, error, id, ...props }, ref) => {
  const generatedId = React.useId();
  const inputId = id || generatedId;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className="grid gap-2">
      {label && (
        <Label htmlFor={inputId} className={cn(error && 'text-destructive')}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <Input id={inputId} className={cn(error && 'border-destructive focus-visible:ring-destructive', className)} aria-invalid={!!error} aria-describedby={errorId} ref={ref} {...props} />
      {error && (
        <p id={errorId} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
});
TextInput.displayName = 'TextInput';

export { TextInput };
