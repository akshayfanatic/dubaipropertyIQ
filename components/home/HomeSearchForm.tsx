'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, CircleDollarSign, Search } from 'lucide-react';
import { z } from 'zod';
import BaseForm from '@/components/shared/forms/BaseForm';
import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { SelectField } from '@/components/shared/select-field';
import { useCategories } from '@/hooks/data/public/useCategories';
import { LocationAutocomplete } from '@/components/shared/forms/location-autocomplete';
import { PriceRangeInput } from '@/components/shared/forms/price-range-input';
import { Button } from '@/components/ui/button';
import type { AutocompleteResult } from '@/hooks/data/public/useLocationAutocomplete';
import { cn } from '@/lib/utils';

const priceRangeSchema = z.object({
  min: z.string().optional(),
  max: z.string().optional(),
});

export const searchSchema = z.object({
  location: z.string(),
  propertyType: z.string(),
  priceRange: priceRangeSchema,
});

interface HomeSearchFormProps {
  className?: string;
}

function SearchSegment({ icon: Icon, children, className }: { icon: React.ComponentType<{ className?: string }>; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex h-11 w-full min-w-0 items-center gap-2 rounded-full px-3 text-foreground transition-colors focus-within:bg-muted/45 hover:bg-muted/35 md:h-12', className)}>
      <Icon className="size-4 shrink-0 text-primary" />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

export default function HomeSearchForm({ className }: HomeSearchFormProps) {
  const router = useRouter();
  const { categories, isLoading: categoriesLoading } = useCategories();
  const [selectedLocation, setSelectedLocation] = useState<AutocompleteResult>();

  const handleSubmit = (data: z.infer<typeof searchSchema>) => {
    const params = new URLSearchParams();

    if (selectedLocation?.slug) {
      params.set('location', selectedLocation.label);
    } else if (data.location) {
      params.set('q', data.location);
    }
    if (data.propertyType) params.set('categories', data.propertyType);
    if (data.priceRange.min) params.set('minPrice', data.priceRange.min);
    if (data.priceRange.max) params.set('maxPrice', data.priceRange.max);

    const queryString = params.toString();
    router.push(`/search${queryString ? `?${queryString}` : ''}`);
  };

  return (
    <div
      className={cn(
        'mx-auto w-full max-w-[760px] overflow-hidden rounded-[18px] bg-background p-2 shadow-2xl shadow-foreground/30 transition-shadow focus-within:ring-3 focus-within:ring-primary/30 md:rounded-full md:p-[7px]',
        '[&_input]:h-11 [&_input]:min-w-0 [&_input]:border-0 [&_input]:bg-transparent [&_input]:px-0 [&_input]:pl-7 [&_input]:text-sm [&_input]:font-medium [&_input]:text-foreground [&_input]:shadow-none [&_input]:placeholder:text-muted-foreground [&_input]:focus-visible:ring-0 [&_input]:focus-visible:ring-offset-0 md:[&_input]:h-12 md:[&_input]:text-base',
        '[&_svg.absolute]:left-0 [&_svg.absolute]:size-4 **:data-[slot=select-trigger]:h-11 **:data-[slot=select-trigger]:min-w-0 **:data-[slot=select-trigger]:border-0 **:data-[slot=select-trigger]:bg-transparent **:data-[slot=select-trigger]:px-0 **:data-[slot=select-trigger]:text-sm **:data-[slot=select-trigger]:font-semibold **:data-[slot=select-trigger]:shadow-none **:data-[slot=select-trigger]:focus:ring-0 md:**:data-[slot=select-trigger]:h-12',
        className,
      )}
    >
      <BaseForm
        schema={searchSchema}
        onSubmit={handleSubmit}
        defaultValues={{ location: '', propertyType: '', priceRange: { min: '', max: '' } }}
        className="flex flex-wrap items-center gap-1 md:flex-nowrap"
      >
        {(form) => (
          <>
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className="min-w-0 flex-[1_0_100%] md:flex-1">
                  <div className="flex h-11 min-w-0 items-center rounded-full px-3 transition-colors focus-within:bg-muted/45 hover:bg-muted/35 md:h-12">
                    <FormControl>
                      <LocationAutocomplete value={field.value} onChange={field.onChange} onSelect={setSelectedLocation} placeholder="Search any area, building or developer" autoComplete="off" />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="propertyType"
              render={({ field }) => (
                <FormItem className="min-w-0 flex-[1_0_100%] sm:flex-[1_0_calc(50%_-_0.25rem)] md:flex-none">
                  <SearchSegment icon={Building2} className="md:w-38 md:border-l md:border-border/80 md:rounded-none">
                    <FormControl>
                      <SelectField options={categories} placeholder="Any type" value={field.value} onValueChange={field.onChange} disabled={categoriesLoading} />
                    </FormControl>
                  </SearchSegment>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priceRange"
              render={({ field }) => (
                <FormItem className="min-w-0 flex-[1_0_100%] sm:flex-[1_0_calc(50%_-_0.25rem)] md:flex-none">
                  <SearchSegment icon={CircleDollarSign} className="md:w-56 md:border-l md:border-border/80 md:rounded-none">
                    <FormControl>
                      <PriceRangeInput value={field.value} onChange={field.onChange} className="min-w-0 gap-1 [&>*]:min-w-0" />
                    </FormControl>
                  </SearchSegment>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              size="lg"
              className="min-h-11 flex-[1_0_100%] cursor-pointer gap-2.5 rounded-full px-7 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-transform hover:-translate-y-0.5 md:min-h-12 md:flex-none md:px-8 md:text-[15px]"
            >
              <Search className="size-5" />
              <span>Search</span>
            </Button>
          </>
        )}
      </BaseForm>
    </div>
  );
}

export function HomeSearchFormSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[760px] animate-pulse rounded-[18px] bg-background p-2 shadow-2xl shadow-foreground/30 md:rounded-full md:p-[7px]">
      <div className="flex flex-wrap items-center gap-1 md:flex-nowrap">
        <div className="h-11 flex-[1_0_100%] rounded-full bg-muted md:h-12 md:flex-1" />
        <div className="h-11 flex-[1_0_100%] rounded-full bg-muted sm:flex-[1_0_calc(50%_-_0.25rem)] md:h-12 md:w-38 md:flex-none" />
        <div className="h-11 flex-[1_0_100%] rounded-full bg-muted sm:flex-[1_0_calc(50%_-_0.25rem)] md:h-12 md:w-56 md:flex-none" />
        <div className="h-11 flex-[1_0_100%] rounded-full bg-primary/20 md:h-12 md:flex-none md:w-30" />
      </div>
    </div>
  );
}
