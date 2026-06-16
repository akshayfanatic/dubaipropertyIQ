'use client';

import { useMemo } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { SelectOption } from '@/types/shared';
import { ImageObject } from '@/types/images';
import Select, { MultiValue, StylesConfig, components, OptionProps, MultiValueGenericProps } from 'react-select';

interface MultiSelectOption extends SelectOption {
  logo_url?: ImageObject | null;
}

interface MultiSelectProps {
  name: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  options: MultiSelectOption[];
  value?: string[];
  onChange: (value: string[]) => void;
  error?: string;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
}

// React Select styles mapped to the same theme tokens used by Input and SelectTrigger.
const createCustomStyles = (): StylesConfig<MultiSelectOption, true> => ({
  control: (base, state) => ({
    ...base,
    minHeight: '44px',
    borderRadius: '0.5rem',
    borderColor: state.isFocused ? 'var(--ring)' : 'var(--input)',
    backgroundColor: 'var(--background)',
    color: 'var(--foreground)',
    boxShadow: state.isFocused ? '0 0 0 2px var(--ring)' : 'none',
    transition: 'border-color 150ms ease, box-shadow 150ms ease',
    '&:hover': {
      borderColor: state.isFocused ? 'var(--ring)' : 'var(--input)',
    },
  }),
  valueContainer: (base) => ({
    ...base,
    padding: '4px 10px',
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: 'var(--muted)',
    borderRadius: '6px',
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: 'var(--foreground)',
    fontSize: '0.875rem',
    padding: '4px 8px',
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: 'var(--muted-foreground)',
    ':hover': {
      backgroundColor: 'var(--destructive)',
      color: 'var(--destructive-foreground)',
    },
  }),
  placeholder: (base) => ({
    ...base,
    color: 'var(--muted-foreground)',
    fontSize: '0.875rem',
  }),
  option: (base, state) => ({
    ...base,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: state.isSelected ? 'var(--primary)' : state.isFocused ? 'var(--accent)' : 'var(--background)',
    color: state.isSelected ? 'var(--primary-foreground)' : state.isFocused ? 'var(--accent-foreground)' : 'var(--foreground)',
    ':active': {
      backgroundColor: 'var(--accent)',
    },
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: 'var(--background)',
    border: '1px solid var(--border)',
    borderRadius: '0.5rem',
    boxShadow: '0 12px 28px oklch(0.2 0.03 263.61 / 0.12)',
    overflow: 'hidden',
    zIndex: 50,
  }),
  menuList: (base) => ({
    ...base,
    backgroundColor: 'var(--background)',
    color: 'var(--foreground)',
    padding: '4px',
  }),
  singleValue: (base) => ({
    ...base,
    color: 'var(--foreground)',
  }),
  input: (base) => ({
    ...base,
    color: 'var(--foreground)',
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: 'var(--muted-foreground)',
    ':hover': {
      color: 'var(--foreground)',
    },
  }),
  indicatorSeparator: (base) => ({
    ...base,
    backgroundColor: 'var(--border)',
  }),
  clearIndicator: (base) => ({
    ...base,
    color: 'var(--muted-foreground)',
    ':hover': {
      color: 'var(--destructive)',
    },
  }),
  noOptionsMessage: (base) => ({
    ...base,
    color: 'var(--muted-foreground)',
  }),
});

// Custom Option component with logo support
const CustomOption = ({ children, ...props }: OptionProps<MultiSelectOption, true>) => {
  const { data } = props;

  return (
    <components.Option {...props}>
      <div className="flex items-center gap-2">
        {data.logo_url?.url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.logo_url.url} alt={data.logo_url.alt_tag || data.label} className="h-5 w-5 rounded object-cover shrink-0" />
        )}
        <span>{children}</span>
      </div>
    </components.Option>
  );
};

// Custom MultiValueLabel component with logo support in selected items
const CustomMultiValueLabel = (props: MultiValueGenericProps<MultiSelectOption, true>) => {
  const { data } = props;

  return (
    <components.MultiValueLabel {...props}>
      <div className="flex items-center gap-1.5">
        {data.logo_url?.url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.logo_url.url} alt={data.logo_url.alt_tag || data.label} className="h-3.5 w-3.5 rounded object-cover shrink-0" />
        )}
        <span>{props.children}</span>
      </div>
    </components.MultiValueLabel>
  );
};

export function MultiSelect({ name, label, required = false, placeholder = 'Select options...', options, value, onChange, error, disabled = false, isLoading = false, className }: MultiSelectProps) {
  const customStyles = useMemo(() => createCustomStyles(), []);

  const selectedOptions = options.filter((option) => value?.includes(option.value));

  const handleChange = (newValue: MultiValue<MultiSelectOption>) => {
    onChange(newValue.map((item) => item.value));
  };

  return (
    <div className={cn('grid gap-2', className)}>
      {label && (
        <Label htmlFor={name} className={cn(error && 'text-destructive')}>
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
      )}
      <Select
        instanceId={name}
        inputId={name}
        isMulti
        options={options}
        value={selectedOptions}
        onChange={handleChange}
        styles={customStyles}
        components={{ Option: CustomOption, MultiValueLabel: CustomMultiValueLabel }}
        placeholder={isLoading ? 'Loading...' : placeholder}
        isDisabled={disabled || isLoading}
        isLoading={isLoading}
        isClearable
        classNames={{
          control: () => cn('min-h-[42px]', error && 'border-destructive'),
        }}
        classNamePrefix="react-select"
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
