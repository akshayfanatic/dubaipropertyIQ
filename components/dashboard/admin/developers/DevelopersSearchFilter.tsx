'use client';

import { useEffect, useRef } from 'react';
import { useForm, FormProvider, useWatch, Controller } from 'react-hook-form';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { ResetButton } from '@/components/shared/forms/reset-button';

interface DevelopersSearchForm {
  search: string;
}

const getValuesFromParams = (params: URLSearchParams): DevelopersSearchForm => ({
  search: params.get('search') || '',
});

export function DevelopersSearchFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const methods = useForm<DevelopersSearchForm>({
    defaultValues: getValuesFromParams(searchParams),
  });
  const { control, reset } = methods;
  const isSyncingRef = useRef(false);
  const lastSyncedRef = useRef<string>('');

  const syncToUrl = useDebouncedCallback((values: DevelopersSearchForm) => {
    if (isSyncingRef.current) return;

    const params = new URLSearchParams(searchParams.toString());

    if (values.search) {
      params.set('search', values.search);
    } else {
      params.delete('search');
    }

    // Reset to page 1 when search changes
    params.delete('page');

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

    lastSyncedRef.current = JSON.stringify(values);
    router.replace(newUrl);
  }, 300);

  const watchedValues = useWatch({ control });

  useEffect(() => {
    const valuesString = JSON.stringify(watchedValues);
    if (valuesString !== lastSyncedRef.current) {
      syncToUrl(watchedValues as DevelopersSearchForm);
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
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Controller
            name="search"
            control={control}
            render={({ field }) => (
              <>
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input type="search" {...field} value={field.value ?? ''} placeholder="Search developers..." className="pl-10" />
              </>
            )}
          />
        </div>
        <ResetButton onReset={() => reset()} />
      </div>
    </FormProvider>
  );
}
