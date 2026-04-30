'use client';

import { SelectField } from '../select-field';
import { cn } from '@/lib/utils';
import { SelectOption } from '@/types/shared';

const PRICE_OPTIONS: SelectOption[] = Array.from({ length: 25 }, (_, i) => {
  const price = (i + 1) * 20000;
  return { value: price.toString(), label: `${(price / 1000).toFixed(0)}K` };
});

interface PriceRangeInputProps {
  value: { min?: string; max?: string };
  onChange: (value: { min?: string; max?: string }) => void;
  className?: string;
}

export function PriceRangeInput({ value, onChange, className }: PriceRangeInputProps) {
  const minPrice = value.min ? parseInt(value.min) : 0;

  const filteredMaxOptions = PRICE_OPTIONS.filter((opt) => {
    const optPrice = parseInt(opt.value);
    return !value.min || optPrice >= minPrice;
  });

  const filteredMinOptions = PRICE_OPTIONS.filter((opt) => {
    const optPrice = parseInt(opt.value);
    return !value.max || optPrice <= parseInt(value.max);
  });

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <SelectField
        options={filteredMinOptions}
        placeholder="Min Price"
        value={value.min ?? ''}
        onValueChange={(val) => onChange({ ...value, min: val || undefined, max: value.max && parseInt(value.max) < parseInt(val) ? undefined : value.max })}
        className="h-11 w-full"
      />
      <span className="text-muted-foreground">-</span>
      <SelectField options={filteredMaxOptions} placeholder="Max Price" value={value.max ?? ''} onValueChange={(val) => onChange({ ...value, max: val || undefined })} className="h-11 w-full" />
    </div>
  );
}
