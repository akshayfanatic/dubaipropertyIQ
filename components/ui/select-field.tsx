'use client';

import * as React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { ImageObject } from '@/types/images';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';

export interface SelectOption {
  label: string;
  value: string;
  logo_url?: string | ImageObject | null;
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
  // Helper to extract logo URL from either string or ImageObject
  const getLogoUrl = (logo_url: string | ImageObject | null | undefined): string | null => {
    if (!logo_url) return null;
    if (typeof logo_url === 'string') return logo_url;
    return logo_url.url;
  };

  const getLogoAlt = (logo_url: string | ImageObject | null | undefined): string => {
    if (!logo_url) return '';
    if (typeof logo_url === 'string') return '';
    return logo_url.alt_tag || '';
  };

  return (
    <Select value={value} defaultValue={defaultValue} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger ref={ref} className={cn('w-full min-w-0', className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent position="popper" className="max-h-60">
        {options.map((option) => {
          const logoSrc = getLogoUrl(option.logo_url);
          const logoAlt = getLogoAlt(option.logo_url) || option.label;
          return (
            <SelectItem key={option.value} value={option.value} className="flex items-center gap-2">
              <div className="h-4 w-4 shrink-0">
                <ImageWithFallback src={logoSrc} alt={logoAlt} width={16} height={16} className="rounded-sm object-cover" fallbackClassName="rounded-sm bg-muted" useInitials={true} />
              </div>
              <span>{option.label}</span>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
});
SelectField.displayName = 'SelectField';

export { SelectField };
