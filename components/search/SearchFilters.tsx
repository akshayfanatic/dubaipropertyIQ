'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useFormContext } from 'react-hook-form';
import { useDebouncedCallback } from 'use-debounce';
import BaseForm from '@/components/shared/forms/BaseForm';
import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { SelectField } from '@/components/shared/select-field';
import { useCategories } from '@/hooks/data/public/useCategories';
import { LocationAutocomplete } from '@/components/shared/forms/location-autocomplete';
import { PriceRangeInput } from '@/components/shared/forms/price-range-input';
import { filterSchema, type FilterSchema } from './types';
import type { AutocompleteResult } from '@/hooks/data/public/useLocationAutocomplete';

export default function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { categories, isLoading: categoriesLoading } = useCategories();
  const [selectedLocation, setSelectedLocation] = useState<AutocompleteResult | undefined>();

  const buildUrl = (data: FilterSchema) => {
    const params = new URLSearchParams();

    if (selectedLocation?.slug) {
      params.set('location', selectedLocation.label);
    } else if (data.location) {
      params.set('q', data.location);
    }
    if (data.propertyType) params.set('categories', data.propertyType);
    if (data.priceRange.min) params.set('minPrice', data.priceRange.min);
    if (data.priceRange.max) params.set('maxPrice', data.priceRange.max);

    return `/search?${params.toString()}`;
  };

  const amenitiesParam = searchParams.get('amenities');
  const defaultAmenities = amenitiesParam ? amenitiesParam.split(',') : [];
  const goldenVisaParam = searchParams.get('golden_visa_eligible');

  return (
    <BaseForm
      key={selectedLocation?.slug || 'default'}
      schema={filterSchema}
      onSubmit={(data) => router.push(buildUrl(data))}
      defaultValues={{
        location: searchParams.get('q') || searchParams.get('location') || '',
        propertyType: searchParams.get('categories') || '',
        priceRange: {
          min: searchParams.get('minPrice') || '',
          max: searchParams.get('maxPrice') || '',
        },
        amenities: defaultAmenities,
        goldenVisaEligible: goldenVisaParam === 'true',
      }}
      mode="onChange"
      className="flex flex-wrap gap-3 w-full"
    >
      <FilterFields categories={categories} categoriesLoading={categoriesLoading} onLocationSelect={setSelectedLocation} buildUrl={buildUrl} />
    </BaseForm>
  );
}

interface FilterFieldsProps {
  categories: Array<{ value: string; label: string }>;
  categoriesLoading: boolean;
  onLocationSelect: (location: AutocompleteResult | undefined) => void;
  buildUrl: (data: FilterSchema) => string;
}

function FilterFields({ categories, categoriesLoading, onLocationSelect, buildUrl }: FilterFieldsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const form = useFormContext<FilterSchema>();
  const isSyncingRef = useRef(false);

  const debouncedPush = useDebouncedCallback((url: string) => {
    if (!isSyncingRef.current) {
      router.push(url);
    }
  }, 500);

  // Sync form with URL when reset from sidebar
  useEffect(() => {
    const currentAmenities = form.getValues('amenities') || [];
    const amenitiesParam = searchParams.get('amenities');
    const goldenVisaParam = searchParams.get('golden_visa_eligible');

    // If URL has no amenity params but form does, reset form
    if (!amenitiesParam && !goldenVisaParam && currentAmenities.length > 0) {
      form.reset({
        ...form.getValues(),
        amenities: [],
        goldenVisaEligible: false,
      });
    }
  }, [searchParams, form]);

  useEffect(() => {
    const subscription = form.watch((value, { type }) => {
      if (type === 'change') {
        debouncedPush(buildUrl(value as FilterSchema));
      }
    });
    return () => subscription.unsubscribe();
  }, [form, buildUrl, debouncedPush]);

  return (
    <>
      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem className="flex-1 min-w-48 max-w-sm">
            <FormControl>
              <LocationAutocomplete value={field.value || ''} onChange={field.onChange} onSelect={onLocationSelect} placeholder="Search e.g Location, Property" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="propertyType"
        render={({ field }) => (
          <FormItem className="w-full max-w-sm shrink-0">
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
          <FormItem className="w-full sm:w-auto shrink-0">
            <FormControl>
              <PriceRangeInput value={field.value} onChange={field.onChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
