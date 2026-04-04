'use client';

import { useEffect, useRef } from 'react';
import { useForm, FormProvider, useWatch, Controller } from 'react-hook-form';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { Input } from '@/components/ui/input';
import { SelectField } from '@/components/shared/select-field';
import { Search } from 'lucide-react';
import useSWR from 'swr';
import { fetcher } from '@/lib/utils';
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

  const { data: cityOptions = [], isLoading: isLoadingCities } = useSWR<CityOption[]>('/api/admin/cities/options', fetcher);

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
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <Controller
            name="search"
            control={control}
            render={({ field }) => (
              <>
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input type="search" {...field} value={field.value ?? ''} placeholder="Search areas..." className="pl-10" />
              </>
            )}
          />
        </div>
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
      </div>
    </FormProvider>
  );
}
