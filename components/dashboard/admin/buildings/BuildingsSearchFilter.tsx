'use client';

import { Controller, FormProvider, useForm } from 'react-hook-form';
import { parseAsString, useQueryStates } from 'nuqs';
import useSWR from 'swr';
import { useDebouncedCallback } from 'use-debounce';
import { SearchInput } from '@/components/shared/forms/search-input';
import { ResetButton } from '@/components/shared/forms/reset-button';
import { FilterFieldSet } from '@/components/shared/forms/filter-fieldset';
import { SelectField } from '@/components/shared/select-field';
import type { AreaOption } from '@/types/areas';
import type { CityOption } from '@/types/city';
import type { DeveloperOption } from '@/types/developer';

interface BuildingsSearchForm {
  search: string;
  city_id: string;
  area_id: string;
  developer_id: string;
}

const buildingsSearchParsers = {
  search: parseAsString.withDefault(''),
  city_id: parseAsString.withDefault(''),
  area_id: parseAsString.withDefault(''),
  developer_id: parseAsString.withDefault(''),
  page: parseAsString.withDefault('1'),
};

const queryToFormValues = (query: Omit<Record<keyof typeof buildingsSearchParsers, string>, 'page'>): BuildingsSearchForm => ({
  search: query.search,
  city_id: query.city_id,
  area_id: query.area_id,
  developer_id: query.developer_id,
});

const formValuesToQuery = (values: BuildingsSearchForm) => ({
  search: values.search || null,
  city_id: values.city_id || null,
  area_id: values.area_id || null,
  developer_id: values.developer_id || null,
  page: null,
});

export function BuildingsSearchFilter() {
  const { data: cityOptions = [], isLoading: isLoadingCities } = useSWR<CityOption[]>('/api/admin/cities/options');
  const { data: areaOptions = [], isLoading: isLoadingAreas } = useSWR<AreaOption[]>('/api/admin/areas/options');
  const { data: developerOptions = [], isLoading: isLoadingDevelopers } = useSWR<DeveloperOption[]>('/api/admin/developers/options');
  const [query, setQuery] = useQueryStates(buildingsSearchParsers, {
    shallow: false,
    history: 'replace',
  });
  const isLoadingOptions = isLoadingCities || isLoadingAreas || isLoadingDevelopers;

  const methods = useForm<BuildingsSearchForm>({
    defaultValues: queryToFormValues(query),
  });
  const { control, reset } = methods;

  const updateQuery = useDebouncedCallback((values: BuildingsSearchForm) => setQuery(formValuesToQuery(values)), 300);

  return (
    <FormProvider {...methods}>
      <FilterFieldSet>
        <Controller
          name="search"
          control={control}
          render={({ field }) => (
            <SearchInput
              value={field.value}
              onChange={(value) => {
                field.onChange(value);
                updateQuery({ ...methods.getValues(), search: value });
              }}
              placeholder="Search buildings..."
              className="max-w-sm"
            />
          )}
        />
        <Controller
          name="city_id"
          control={control}
          render={({ field }) => (
            <SelectField
              value={field.value}
              onValueChange={(value) => {
                field.onChange(value);
                updateQuery({ ...methods.getValues(), city_id: value });
              }}
              options={cityOptions}
              placeholder="City"
              className="w-44"
              disabled={isLoadingOptions}
            />
          )}
        />
        <Controller
          name="area_id"
          control={control}
          render={({ field }) => (
            <SelectField
              value={field.value}
              onValueChange={(value) => {
                field.onChange(value);
                updateQuery({ ...methods.getValues(), area_id: value });
              }}
              options={areaOptions}
              placeholder="Area"
              className="w-52"
              disabled={isLoadingOptions}
            />
          )}
        />
        <Controller
          name="developer_id"
          control={control}
          render={({ field }) => (
            <SelectField
              value={field.value}
              onValueChange={(value) => {
                field.onChange(value);
                updateQuery({ ...methods.getValues(), developer_id: value });
              }}
              options={developerOptions}
              placeholder="Developer"
              className="w-52"
              disabled={isLoadingOptions}
            />
          )}
        />

        <ResetButton
          onReset={() => {
            const emptyValues = { search: '', city_id: '', area_id: '', developer_id: '' };
            reset(emptyValues);
            setQuery(formValuesToQuery(emptyValues));
          }}
        />
      </FilterFieldSet>
    </FormProvider>
  );
}
