'use client';

import { useEffect, useRef } from 'react';
import { useForm, FormProvider, useWatch, Controller } from 'react-hook-form';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { SelectField } from '@/components/shared/select-field';
import { SearchInput } from '@/components/shared/forms/search-input';
import { ResetButton } from '@/components/shared/forms/reset-button';
import { FilterFieldSet } from '@/components/shared/forms/filter-fieldset';
import useSWR from 'swr';
import { CityOption } from '@/types/city';

interface AreasSearchForm {
  search: string;
  city: string;
}

const getValuesFromParams = (searchParams: URLSearchParams): AreasSearchForm => ({
  search: searchParams.get('search') || '',
  city: searchParams.get('city') || '',
});

export function AreasSearchFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const isSyncingRef = useRef(false);
  const lastSyncedRef = useRef<string>('');

  const { data: cityOptions = [], isLoading: isLoadingCities } = useSWR<CityOption[]>('/api/admin/cities/options');

  const methods = useForm<AreasSearchForm>({
    defaultValues: getValuesFromParams(searchParams),
  });

  const { control, reset } = methods;
  const watchedValues = useWatch({ control });

  const syncToUrl = useDebouncedCallback((values: AreasSearchForm) => {
    if (isSyncingRef.current) return;

    const params = new URLSearchParams();
    if (values.search) {
      params.set('search', values.search);
    }
    if (values.city && values.city !== 'all') {
      params.set('city', values.city);
    }
    // Reset to page 1 when filters change
    params.delete('page');

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

    lastSyncedRef.current = JSON.stringify(values);
    router.replace(newUrl);
  }, 300);

  useEffect(() => {
    const valuesString = JSON.stringify(watchedValues);
    if (valuesString !== lastSyncedRef.current) {
      syncToUrl(watchedValues as AreasSearchForm);
    }
  }, [watchedValues, syncToUrl]);

  useEffect(() => {
    const formValues = getValuesFromParams(searchParams);
    const formValuesString = JSON.stringify(formValues);

    if (formValuesString !== lastSyncedRef.current) {
      isSyncingRef.current = true;
      reset(formValues);
      lastSyncedRef.current = formValuesString;
      requestAnimationFrame(() => {
        isSyncingRef.current = false;
      });
    }
  }, [searchParams, reset]);

  return (
    <FormProvider {...methods}>
      <FilterFieldSet>
        {/* Search field - filters areas by name */}
        <Controller name="search" control={control} render={({ field }) => <SearchInput value={field.value} onChange={field.onChange} placeholder="Search areas..." className="max-w-sm" />} />

        {/* City field - filters areas by city */}
        <Controller
          name="city"
          control={control}
          render={({ field }) => (
            <SelectField
              options={cityOptions}
              placeholder={isLoadingCities ? 'Loading...' : 'Filter by city'}
              value={field.value}
              onValueChange={field.onChange}
              className="w-48"
              disabled={isLoadingCities}
            />
          )}
        />

        <ResetButton onReset={() => reset()} />
      </FilterFieldSet>
    </FormProvider>
  );
}
