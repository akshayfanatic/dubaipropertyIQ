'use client';

import { useEffect, useRef } from 'react';
import { useForm, FormProvider, useWatch, Controller } from 'react-hook-form';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { SearchInput } from '@/components/shared/forms/search-input';
import { ResetButton } from '@/components/shared/forms/reset-button';
import { FilterFieldSet } from '@/components/shared/forms/filter-fieldset';

interface CategoriesSearchForm {
  search: string;
}

const getValuesFromParams = (searchParams: URLSearchParams): CategoriesSearchForm => ({
  search: searchParams.get('search') || '',
});

export function CategoriesSearchFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const isSyncingRef = useRef(false);
  const lastSyncedRef = useRef<string>('');

  const methods = useForm<CategoriesSearchForm>({
    defaultValues: getValuesFromParams(searchParams),
  });

  const { control, reset } = methods;
  const watchedValues = useWatch({ control });

  const syncToUrl = useDebouncedCallback((values: CategoriesSearchForm) => {
    if (isSyncingRef.current) return;

    const params = new URLSearchParams();
    if (values.search) {
      params.set('search', values.search);
    }
    // Reset to page 1 when search changes
    params.delete('page');

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

    lastSyncedRef.current = JSON.stringify(values);
    router.replace(newUrl);
  }, 300);

  useEffect(() => {
    const valuesString = JSON.stringify(watchedValues);
    if (valuesString !== lastSyncedRef.current) {
      syncToUrl(watchedValues as CategoriesSearchForm);
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
        {/* Search field - filters categories by name */}
        <Controller name="search" control={control} render={({ field }) => <SearchInput value={field.value} onChange={field.onChange} placeholder="Search categories..." className="max-w-sm" />} />

        <ResetButton onReset={() => reset()} />
      </FilterFieldSet>
    </FormProvider>
  );
}
