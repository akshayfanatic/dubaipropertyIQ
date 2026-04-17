'use client';

import * as React from 'react';
import { LucideIcon } from 'lucide-react';

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  required?: boolean;
  error?: string;
  icon?: LucideIcon;
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(({ className, label, required, error, id, icon: Icon, ...props }, ref) => {
  const generatedId = React.useId();
  const textareaId = id || generatedId;
  const errorId = error ? `${textareaId}-error` : undefined;

  return (
    <div className="grid gap-2">
      {label && (
        <div className="flex items-center gap-2">
          <Label htmlFor={textareaId} className={cn(error && 'text-destructive')}>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>
          {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        </div>
      )}
      <Textarea id={textareaId} className={cn(error && 'aria-invalid:border-destructive', className)} aria-invalid={!!error} aria-describedby={errorId} ref={ref} {...props} />
      {error && (
        <p id={errorId} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
});
TextArea.displayName = 'TextArea';

export { TextArea };
