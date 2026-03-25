'use client';

import { useEffect, useRef } from 'react';
import { useForm, FormProvider, useWatch } from 'react-hook-form';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { FilterBar, type FilterFormValues } from '../_ui';

const getValuesFromParams = (searchParams: URLSearchParams): FilterFormValues => ({
  search: searchParams.get('search') || '',
  property_type: searchParams.get('property_type') || '',
  status: searchParams.get('status') || '',
  bedrooms: searchParams.get('bedrooms') ? Number(searchParams.get('bedrooms')) : '',
  min_price: searchParams.get('min_price') ? Number(searchParams.get('min_price')) : '',
  max_price: searchParams.get('max_price') ? Number(searchParams.get('max_price')) : '',
  min_size: searchParams.get('min_size') ? Number(searchParams.get('min_size')) : '',
  max_size: searchParams.get('max_size') ? Number(searchParams.get('max_size')) : '',
  golden_visa_eligible: searchParams.get('golden_visa_eligible') === 'true',
});

export const TopBarFilter = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const isSyncingRef = useRef(false);
  const lastSyncedRef = useRef<string>('');

  const methods = useForm<FilterFormValues>({
    defaultValues: getValuesFromParams(searchParams),
  });

  const { control, reset } = methods;
  const watchedValues = useWatch({ control });

  const syncToUrl = useDebouncedCallback((values: FilterFormValues) => {
    if (isSyncingRef.current) return;

    const params = new URLSearchParams();
    Object.entries(values).forEach(([key, value]) => {
      if (value !== '' && value !== false && value !== undefined && value !== null) {
        params.set(key, String(value));
      }
    });

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

    lastSyncedRef.current = JSON.stringify(values);
    router.replace(newUrl);
  }, 300);

  useEffect(() => {
    const valuesString = JSON.stringify(watchedValues);
    if (valuesString !== lastSyncedRef.current) {
      syncToUrl(watchedValues as FilterFormValues);
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
      <FilterBar />
    </FormProvider>
  );
};
