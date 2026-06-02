'use client';

import { useRouter } from 'next/navigation';
import { ChevronDown, MapPin } from 'lucide-react';
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
        className="group h-[54px] w-[min(340px,calc(100vw-2rem))] rounded-full border border-primary-foreground/25 bg-background/90 px-4 text-base font-bold text-foreground shadow-[0_24px_54px_oklch(0.18_0.05_260.47_/_0.28)] backdrop-blur-xl transition-colors hover:bg-background/95 focus-visible:ring-2 focus-visible:ring-primary-foreground/55 focus-visible:ring-offset-0 [&>svg]:hidden"
      >
        <MapPin className="size-5 text-primary" aria-hidden="true" />
        <span className="flex min-w-0 flex-1 items-center text-left">
          <SelectValue placeholder={selectedCity?.label ?? 'City'} />
        </span>
        <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
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
