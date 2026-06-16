'use client';

import { Controller, FormProvider, useForm } from 'react-hook-form';
import { parseAsString, useQueryStates } from 'nuqs';
import { useDebouncedCallback } from 'use-debounce';
import { FilterFieldSet } from '@/components/shared/forms/filter-fieldset';
import { ResetButton } from '@/components/shared/forms/reset-button';
import { SearchInput } from '@/components/shared/forms/search-input';

interface BlogTagsSearchForm {
  search: string;
}

const blogTagsSearchParsers = {
  search: parseAsString.withDefault(''),
  page: parseAsString.withDefault('1'),
};

const queryToFormValues = (query: Omit<Record<keyof typeof blogTagsSearchParsers, string>, 'page'>): BlogTagsSearchForm => ({
  search: query.search,
});

const formValuesToQuery = (values: BlogTagsSearchForm) => ({
  search: values.search || null,
  page: null,
});

export function BlogTagsSearchFilter() {
  const [query, setQuery] = useQueryStates(blogTagsSearchParsers, {
    shallow: false,
    history: 'replace',
  });

  const methods = useForm<BlogTagsSearchForm>({
    defaultValues: queryToFormValues(query),
  });

  const { control, reset } = methods;
  const updateQuery = useDebouncedCallback((values: BlogTagsSearchForm) => setQuery(formValuesToQuery(values)), 300);

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
              placeholder="Search blog tags..."
              className="max-w-sm"
            />
          )}
        />
        <ResetButton
          onReset={() => {
            const emptyValues = { search: '' };
            reset(emptyValues);
            setQuery(formValuesToQuery(emptyValues));
          }}
        />
      </FilterFieldSet>
    </FormProvider>
  );
}
