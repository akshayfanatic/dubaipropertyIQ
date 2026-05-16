'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { z } from 'zod';
import BaseForm from '@/components/shared/forms/BaseForm';
import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { SelectField } from '@/components/shared/select-field';
import { useCategories } from '@/hooks/data/public/useCategories';
import { LocationAutocomplete } from '@/components/shared/forms/location-autocomplete';
import { PriceRangeInput } from '@/components/shared/forms/price-range-input';
import { Button } from '@/components/ui/button';
import type { AutocompleteResult } from '@/hooks/data/public/useLocationAutocomplete';

const priceRangeSchema = z.object({
  min: z.string().optional(),
  max: z.string().optional(),
});

export const searchSchema = z.object({
  location: z.string(),
  propertyType: z.string(),
  priceRange: priceRangeSchema,
});

export default function HomeSearchForm() {
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
    <div className="w-full mx-auto max-w-4xl rounded-lg  p-4 md:p-6 md:py-8 shadow-sm border">
      <BaseForm
        schema={searchSchema}
        onSubmit={handleSubmit}
        defaultValues={{ location: '', propertyType: '', priceRange: { min: '', max: '' } }}
        className="flex flex-col gap-4 md:flex-row md:items-end"
      >
        {(form) => (
          <>
            <div className="flex flex-col gap-4 md:flex-row flex-1">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <LocationAutocomplete value={field.value} onChange={field.onChange} onSelect={setSelectedLocation} placeholder="Search location.." autoComplete="off" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="propertyType"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <SelectField options={categories} placeholder="Property Type" value={field.value} onValueChange={field.onChange} disabled={categoriesLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priceRange"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <PriceRangeInput value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" size="lg" className="cursor-pointer text-secondary font-semibold">
              <Search className="h-5 w-5" />
              <span>Search Properties</span>
            </Button>
          </>
        )}
      </BaseForm>
    </div>
  );
}

export function HomeSearchFormSkeleton() {
  return (
    <div className="w-full mx-auto max-w-4xl rounded-lg p-4 md:p-6 md:py-8 shadow-sm border animate-pulse">
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        <div className="flex flex-col gap-4 md:flex-row flex-1">
          {/* Location field */}
          <div className="h-10 flex-1 bg-gray-200 rounded" />
          {/* Property type field */}
          <div className="h-10 flex-1 bg-gray-200 rounded" />
          {/* Price range field */}
          <div className="h-10 flex-1 bg-gray-200 rounded" />
        </div>
        {/* Search button */}
        <div className="h-12 w-full md:w-40 bg-gray-200 rounded" />
      </div>
    </div>
  );
}
