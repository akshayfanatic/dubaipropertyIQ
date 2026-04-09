'use client';

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
}

const customStyles: StylesConfig<MultiSelectOption, true> = {
  control: (base) => ({
    ...base,
    minHeight: '42px',
    borderColor: 'hsl(var(--input))',
    '&:hover': {
      borderColor: 'hsl(var(--ring))',
    },
  }),
  valueContainer: (base) => ({
    ...base,
    padding: '4px 8px',
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: 'hsl(var(--primary) / 0.1)',
    borderRadius: '6px',
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: 'hsl(var(--primary))',
    fontSize: '0.875rem',
    padding: '4px 8px',
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: 'hsl(var(--primary))',
    ':hover': {
      backgroundColor: 'hsl(var(--primary) / 0.2)',
      color: 'hsl(var(--destructive))',
    },
  }),
  placeholder: (base) => ({
    ...base,
    color: 'hsl(var(--muted-foreground))',
    fontSize: '0.875rem',
  }),
  option: (base) => ({
    ...base,
    display: 'flex',
    alignItems: 'center',
  }),
};

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

export function MultiSelect({ name, label, required = false, placeholder = 'Select options...', options, value, onChange, error, disabled = false, isLoading = false }: MultiSelectProps) {
  const selectedOptions = options.filter((option) => value?.includes(option.value));

  const handleChange = (newValue: MultiValue<MultiSelectOption>) => {
    onChange(newValue.map((item) => item.value));
  };

  return (
    <div className="grid gap-2">
      {label && (
        <Label htmlFor={name} className={cn(error && 'text-destructive')}>
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
      )}
      <Select
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
