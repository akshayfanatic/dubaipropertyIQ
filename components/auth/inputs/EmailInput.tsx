'use client';

import * as React from 'react';
import { Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export interface EmailInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string;
}

const EmailInput = React.forwardRef<HTMLInputElement, EmailInputProps>(({ className, containerClassName, ...props }, ref) => {
  return (
    <div className={cn('relative', containerClassName)}>
      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input type="email" className={cn('pl-10', className)} ref={ref} {...props} />
    </div>
  );
});

EmailInput.displayName = 'EmailInput';

export { EmailInput };
