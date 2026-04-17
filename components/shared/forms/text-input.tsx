'use client';

import * as React from 'react';
import { LucideIcon } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  required?: boolean;
  error?: string;
  icon?: LucideIcon;
}

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(({ className, label, required, error, id, icon: Icon, ...props }, ref) => {
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
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />}
        <Input
          id={inputId}
          className={cn(error && 'border-destructive focus-visible:ring-destructive', Icon && 'pl-10', className)}
          aria-invalid={!!error}
          aria-describedby={errorId}
          ref={ref}
          {...props}
        />
      </div>
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
