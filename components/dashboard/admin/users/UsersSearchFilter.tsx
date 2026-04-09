'use client';

import { useEffect, useRef } from 'react';
import { useForm, FormProvider, useWatch, Controller } from 'react-hook-form';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { SelectField } from '@/components/shared/select-field';
import { SearchInput } from '@/components/shared/forms/search-input';
import { ResetButton } from '@/components/shared/forms/reset-button';
import { FilterFieldSet } from '@/components/shared/forms/filter-fieldset';
import { ROLE_OPTIONS } from '@/types/user-admin';

interface UsersSearchForm {
  search: string;
  role: string;
}

const getValuesFromParams = (searchParams: URLSearchParams): UsersSearchForm => ({
  search: searchParams.get('search') || '',
  role: searchParams.get('role') || '',
});

export function UsersSearchFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const isSyncingRef = useRef(false);
  const lastSyncedRef = useRef<string>('');

  const methods = useForm<UsersSearchForm>({
    defaultValues: getValuesFromParams(searchParams),
  });

  const { control, reset } = methods;
  const watchedValues = useWatch({ control });

  const syncToUrl = useDebouncedCallback((values: UsersSearchForm) => {
    if (isSyncingRef.current) return;

    const params = new URLSearchParams();
    if (values.search) {
      params.set('search', values.search);
    }
    if (values.role && values.role !== 'all') {
      params.set('role', values.role);
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
      syncToUrl(watchedValues as UsersSearchForm);
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

  const roleOptions = [{ label: 'All Roles', value: 'all' }, ...ROLE_OPTIONS.map((o) => ({ label: o.label, value: o.value }))];

  return (
    <FormProvider {...methods}>
      <FilterFieldSet>
        {/* Search field - filters users by email */}
        <Controller name="search" control={control} render={({ field }) => <SearchInput value={field.value} onChange={field.onChange} placeholder="Search by email..." className="max-w-sm" />} />

        {/* Role field - filters users by role */}
        <Controller
          name="role"
          control={control}
          render={({ field }) => <SelectField options={roleOptions} placeholder="All Roles" value={field.value || 'all'} onValueChange={field.onChange} className="w-48" />}
        />

        <ResetButton onReset={() => reset()} />
      </FilterFieldSet>
    </FormProvider>
  );
}
