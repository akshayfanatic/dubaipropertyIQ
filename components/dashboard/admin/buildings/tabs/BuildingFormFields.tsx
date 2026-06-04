'use client';

import type { LucideIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { SelectField } from '@/components/shared/select-field';
import { TextInput } from '@/components/shared/forms/text-input';
import type { SelectOption } from '@/types/shared';

export const splitList = (value: string) =>
  value
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter(Boolean);

export const listText = (value?: string[] | null) => value?.join(', ') ?? '';

const toNumberOrNull = (value: string) => {
  if (value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export function SelectGroup({
  label,
  required,
  error,
  field,
  options,
  placeholder,
  disabled,
}: {
  label: string;
  required?: boolean;
  error?: string;
  field: { value?: string | null; onChange: (value: string) => void };
  options: SelectOption[];
  placeholder: string;
  disabled?: boolean;
}) {
  return (
    <div className="grid gap-2">
      <Label>
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </Label>
      <SelectField value={field.value || ''} onValueChange={field.onChange} options={options} placeholder={placeholder} disabled={disabled} />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

export function NumberInput({
  label,
  value,
  onChange,
  min,
  max,
  icon,
}: {
  label: string;
  value?: number | null;
  onChange: (value: number | null) => void;
  min?: number;
  max?: number;
  icon?: LucideIcon;
}) {
  return <TextInput label={label} icon={icon} type="number" min={min} max={max} value={value ?? ''} onChange={(e) => onChange(toNumberOrNull(e.target.value))} />;
}
