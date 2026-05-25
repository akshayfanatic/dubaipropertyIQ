'use client';

import { useRouter } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { SelectOption } from '@/types/shared';

type CitySelectFieldProps = {
  options: SelectOption[];
  value?: string;
};

export function CitySelectField({ options, value }: CitySelectFieldProps) {
  const router = useRouter();
  const selectedCity = options.find((option) => option.value === value);

  const handleCityChange = (slug: string) => {
    router.push(`/areas/${slug}`);
  };

  return (
    <Select value={value} onValueChange={handleCityChange}>
      <SelectTrigger
        aria-label="Explore city"
        className="group h-12 w-auto overflow-hidden rounded-full border-0 bg-background/82 p-0 pr-1 text-base font-semibold text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] transition-colors hover:bg-background/90 focus-visible:ring-2 focus-visible:ring-white/55 focus-visible:ring-offset-0 [&>svg]:hidden"
      >
        <span className="flex h-12 items-center rounded-l-full rounded-r-[26px] bg-primary px-5 text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_10px_24px_rgba(15,23,42,0.18)]">
          Explore
        </span>
        <span className="flex h-12 min-w-[104px] items-center px-5 text-foreground">
          <SelectValue placeholder={selectedCity?.label ?? 'City'} />
        </span>
        <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
          <ChevronDown className="size-5" aria-hidden="true" />
        </span>
      </SelectTrigger>
      <SelectContent
        align="center"
        position="popper"
        className="min-w-[170px] overflow-hidden rounded-xl border border-white/25 bg-background/92 p-1 shadow-[0_20px_60px_rgba(15,23,42,0.22)] backdrop-blur-xl"
      >
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value} className="cursor-pointer rounded-lg px-3 py-2 text-sm text-foreground transition-colors focus:bg-primary/10 focus:text-primary">
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
