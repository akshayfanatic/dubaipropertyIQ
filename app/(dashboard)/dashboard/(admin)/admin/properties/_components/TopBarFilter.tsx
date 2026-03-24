'use client';

import { useState, useEffect, useRef } from 'react';
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
  const [popoverOpen, setPopoverOpen] = useState(false);

  // Track if we're currently syncing to prevent loops
  const isSyncingRef = useRef(false);
  // Track the last synced values to compare
  const lastSyncedRef = useRef<string>('');

  const methods = useForm<FilterFormValues>({
    defaultValues: getValuesFromParams(searchParams),
  });

  const { control, reset } = methods;
  const watchedValues = useWatch({ control });

  // Debounced URL sync
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

    // Store the values we're syncing to prevent loop
    lastSyncedRef.current = JSON.stringify(values);

    router.push(newUrl);
  }, 300);

  // Sync form changes to URL
  useEffect(() => {
    const valuesString = JSON.stringify(watchedValues);
    // Only sync if values changed and it's not from URL sync
    if (valuesString !== lastSyncedRef.current) {
      syncToUrl(watchedValues as FilterFormValues);
    }
  }, [watchedValues, syncToUrl]);

  // Sync URL changes to form (browser back/forward)
  useEffect(() => {
    const formValues = getValuesFromParams(searchParams);
    const formValuesString = JSON.stringify(formValues);

    // Only reset if URL params differ from current form state
    if (formValuesString !== lastSyncedRef.current) {
      isSyncingRef.current = true;
      reset(formValues);
      lastSyncedRef.current = formValuesString;
      // Reset the syncing flag after a brief delay
      requestAnimationFrame(() => {
        isSyncingRef.current = false;
      });
    }
  }, [searchParams, reset]);

  return (
    <FormProvider {...methods}>
      <FilterBar popoverOpen={popoverOpen} onPopoverChange={setPopoverOpen} />
    </FormProvider>
  );
};
