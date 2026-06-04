'use client';

import { Search } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';
import { useFormContext } from 'react-hook-form';
import { useQueryStates } from 'nuqs';
import BaseForm from '@/components/shared/forms/BaseForm';
import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { SelectField } from '@/components/shared/select-field';
import { PriceRangeInput } from '@/components/shared/forms/price-range-input';
import { TextInput } from '../shared/forms/text-input';
import { useCategories } from '@/hooks/data/public/useCategories';
import { filterSchema, filterValuesToQuery, queryToFilterValues, searchQueryParsers, type FilterSchema } from './types';

export default function SearchFilters() {
  const { categories, isLoading: categoriesLoading } = useCategories();

  /**
   * URL STATE
   */
  const [query, setQuery] = useQueryStates(searchQueryParsers, {
    shallow: false,
    history: 'replace',
  });

  /**
   * URL UPDATE
   */
  const updateQuery = useDebouncedCallback((data: FilterSchema) => {
    setQuery(filterValuesToQuery(data));
  }, 500);

  return (
    <BaseForm
      schema={filterSchema}
      mode="onChange"
      onSubmit={() => {}}
      defaultValues={queryToFilterValues(query)}
      className="grid w-full grid-cols-1 gap-3 md:grid-cols-[minmax(16rem,1fr)_minmax(12rem,14rem)] lg:grid-cols-[minmax(18rem,1fr)_minmax(12rem,15rem)_minmax(20rem,24rem)]"
    >
      <FilterFields categories={categories} categoriesLoading={categoriesLoading} updateQuery={updateQuery} />
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
}

function FilterFields({ categories, categoriesLoading, updateQuery }: FilterFieldsProps) {
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
                className="h-11 bg-background text-foreground"
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
                className="h-11 bg-background text-foreground"
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
          <FormItem className="min-w-0 md:col-span-2 lg:col-span-1">
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
