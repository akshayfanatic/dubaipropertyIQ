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
  /** Show logo/icon next to each option */
  showLogo?: boolean;
}

interface SelectLogoProps {
  logo_url: string | ImageObject | null | undefined;
  alt: string;
}

const SelectLogo = ({ logo_url, alt }: SelectLogoProps) => {
  const getLogoUrl = (logo: string | ImageObject | null | undefined): string | null => {
    if (!logo) return null;
    if (typeof logo === 'string') return logo;
    return logo.url;
  };

  const getLogoAlt = (logo: string | ImageObject | null | undefined): string => {
    if (!logo) return alt;
    if (typeof logo === 'string') return alt;
    return logo.alt_tag || alt;
  };

  const logoSrc = getLogoUrl(logo_url);
  if (!logoSrc) return null;

  const logoAlt = getLogoAlt(logo_url);

  return (
    <div className="h-4 w-4 shrink-0">
      <ImageWithFallback src={logoSrc} alt={logoAlt} width={16} height={16} className="rounded-sm object-cover" fallbackClassName="rounded-sm bg-muted" useInitials={true} />
    </div>
  );
};

const SelectField = React.forwardRef<HTMLButtonElement, SelectFieldProps>(
  ({ options = [], placeholder = 'Select...', value, defaultValue, onValueChange, disabled, className, showLogo = false }, ref) => {
    return (
      <Select value={value} defaultValue={defaultValue} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger ref={ref} className={cn('w-full min-w-0', className)}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent position="popper" className="max-h-60">
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value} className="flex items-center gap-2">
              {showLogo && <SelectLogo logo_url={option.logo_url} alt={option.label} />}
              <span>{option.label}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  },
);
SelectField.displayName = 'SelectField';

export { SelectField };
