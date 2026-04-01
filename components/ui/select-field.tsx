'use client';

import * as React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

export interface SelectOption {
  label: string;
  value: string;
  logo_url?: string | null;
}

export interface SelectFieldProps {
  /** Array of options -> [{label, value}] */
  options?: SelectOption[];
  /** Placeholder text */
  placeholder?: string;
  /** Currently selected value (controlled) */
  value?: string;
  /** Default value (uncontrolled) */
  defaultValue?: string;
  /** Callback when value changes */
  onValueChange?: (value: string) => void;
  /** Disable the select */
  disabled?: boolean;
  /** Additional classes for the trigger */
  className?: string;
}

const SelectField = React.forwardRef<HTMLButtonElement, SelectFieldProps>(({ options = [], placeholder = 'Select...', value, defaultValue, onValueChange, disabled, className }, ref) => {
  return (
    <Select value={value} defaultValue={defaultValue} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger ref={ref} className={cn('w-full min-w-0', className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent position="popper" className="max-h-60">
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value} className="flex items-center gap-2">
            {option.logo_url && <img src={option.logo_url} alt="" className="h-4 w-4 rounded-sm object-cover shrink-0" />}
            <span>{option.label}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
});
SelectField.displayName = 'SelectField';

export { SelectField };
