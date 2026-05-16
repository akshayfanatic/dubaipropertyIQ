'use client';

import { Search } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';
import { useFormContext } from 'react-hook-form';
import { useQueryStates, parseAsString, parseAsArrayOf, parseAsBoolean } from 'nuqs';
import BaseForm from '@/components/shared/forms/BaseForm';
import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { SelectField } from '@/components/shared/select-field';
import { PriceRangeInput } from '@/components/shared/forms/price-range-input';
import { TextInput } from '../shared/forms/text-input';
import { useCategories } from '@/hooks/data/public/useCategories';
import { filterSchema, type FilterSchema } from './types';

const defaultValues: FilterSchema = {
  location: '',
  propertyType: '',
  priceRange: {
    min: '',
    max: '',
  },
  amenities: [],
  goldenVisaEligible: false,
};

export default function SearchFilters() {
  const { categories, isLoading: categoriesLoading } = useCategories();

  /**
   * URL STATE
   */
  const [query, setQuery] = useQueryStates(
    {
      q: parseAsString.withDefault(''),
      categories: parseAsString.withDefault(''),
      minPrice: parseAsString.withDefault(''),
      maxPrice: parseAsString.withDefault(''),
      amenities: parseAsArrayOf(parseAsString).withDefault([]),
      golden_visa_eligible: parseAsBoolean.withDefault(false),
    },
    {
      shallow: false,
      history: 'replace',
    },
  );

  /**
   * URL UPDATE
   */
  const updateQuery = useDebouncedCallback((data: FilterSchema) => {
    setQuery({
      q: data.location || null,

      categories: data.propertyType || null,

      minPrice: data.priceRange.min || null,

      maxPrice: data.priceRange.max || null,

      amenities: (data.amenities?.length ?? 0) > 0 ? data.amenities : null,

      golden_visa_eligible: data.goldenVisaEligible || null,
    });
  }, 500);

  /**
   * RESET FILTERS
   */
  const resetQuery = () => {
    setQuery({
      q: null,
      categories: null,
      minPrice: null,
      maxPrice: null,
      amenities: null,
      golden_visa_eligible: null,
    });
  };

  return (
    <BaseForm
      schema={filterSchema}
      mode="onChange"
      onSubmit={() => {}}
      defaultValues={{
        location: query.q,
        propertyType: query.categories,
        priceRange: {
          min: query.minPrice,
          max: query.maxPrice,
        },
        amenities: query.amenities,
        goldenVisaEligible: query.golden_visa_eligible,
      }}
      className="grid w-full grid-cols-1 gap-3 md:grid-cols-[minmax(14rem,1fr)_minmax(12rem,14rem)] xl:grid-cols-[minmax(16rem,1fr)_minmax(12rem,14rem)_minmax(18rem,22rem)]"
    >
      <FilterFields categories={categories} categoriesLoading={categoriesLoading} updateQuery={updateQuery} resetQuery={resetQuery} />
    </BaseForm>
  );
}

interface FilterFieldsProps {
  categories: Array<{
    value: string;
    label: string;
  }>;
  categoriesLoading: boolean;
  updateQuery: (data: FilterSchema) => void;
  resetQuery: () => void;
}

function FilterFields({ categories, categoriesLoading, updateQuery, resetQuery }: FilterFieldsProps) {
  const form = useFormContext<FilterSchema>();

  return (
    <>
      {/* LOCATION */}
      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem className="min-w-0">
            <FormControl>
              <TextInput
                {...field}
                type="search"
                icon={Search}
                placeholder="Location, community, or property"
                className="h-11 bg-background"
                onChange={(e) => {
                  field.onChange(e);

                  updateQuery({
                    ...form.getValues(),
                    location: e.target.value,
                  });
                }}
              />
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />

      {/* PROPERTY TYPE */}
      <FormField
        control={form.control}
        name="propertyType"
        render={({ field }) => (
          <FormItem className="min-w-0">
            <FormControl>
              <SelectField
                value={field.value}
                options={categories}
                disabled={categoriesLoading}
                placeholder="Property type"
                className="h-11 bg-background"
                onValueChange={(value) => {
                  field.onChange(value);

                  updateQuery({
                    ...form.getValues(),
                    propertyType: value,
                  });
                }}
              />
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />

      {/* PRICE RANGE */}
      <FormField
        control={form.control}
        name="priceRange"
        render={({ field }) => (
          <FormItem className="min-w-0 md:col-span-2 xl:col-span-1">
            <FormControl>
              <PriceRangeInput
                value={field.value}
                className="w-full"
                onChange={(value) => {
                  field.onChange(value);

                  updateQuery({
                    ...form.getValues(),
                    priceRange: value,
                  });
                }}
              />
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
