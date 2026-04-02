'use client';

import { useEffect, useRef } from 'react';
import { useForm, FormProvider, useWatch, Controller } from 'react-hook-form';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface CitiesSearchForm {
  search: string;
}

const getValuesFromParams = (searchParams: URLSearchParams): CitiesSearchForm => ({
  search: searchParams.get('search') || '',
});

export function CitiesSearchFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const isSyncingRef = useRef(false);
  const lastSyncedRef = useRef<string>('');

  const methods = useForm<CitiesSearchForm>({
    defaultValues: getValuesFromParams(searchParams),
  });

  const { control, reset } = methods;
  const watchedValues = useWatch({ control });

  const syncToUrl = useDebouncedCallback((values: CitiesSearchForm) => {
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
      syncToUrl(watchedValues as CitiesSearchForm);
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
      <div className="relative flex-1 max-w-sm">
        <Controller
          name="search"
          control={control}
          render={({ field }) => (
            <>
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input type="search" {...field} value={field.value ?? ''} placeholder="Search cities..." className="pl-10" />
            </>
          )}
        />
      </div>
    </FormProvider>
  );
}
