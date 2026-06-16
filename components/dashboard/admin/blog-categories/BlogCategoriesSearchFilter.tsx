'use client';

import { Controller, FormProvider, useForm } from 'react-hook-form';
import { parseAsString, useQueryStates } from 'nuqs';
import { useDebouncedCallback } from 'use-debounce';
import { SearchInput } from '@/components/shared/forms/search-input';
import { ResetButton } from '@/components/shared/forms/reset-button';
import { FilterFieldSet } from '@/components/shared/forms/filter-fieldset';

interface BlogCategoriesSearchForm {
  search: string;
}

const blogCategoriesSearchParsers = {
  search: parseAsString.withDefault(''),
  page: parseAsString.withDefault('1'),
};

const queryToFormValues = (query: Omit<Record<keyof typeof blogCategoriesSearchParsers, string>, 'page'>): BlogCategoriesSearchForm => ({
  search: query.search,
});

const formValuesToQuery = (values: BlogCategoriesSearchForm) => ({
  search: values.search || null,
  page: null,
});

export function BlogCategoriesSearchFilter() {
  const [query, setQuery] = useQueryStates(blogCategoriesSearchParsers, {
    shallow: false,
    history: 'replace',
  });

  const methods = useForm<BlogCategoriesSearchForm>({
    defaultValues: queryToFormValues(query),
  });

  const { control, reset } = methods;
  const updateQuery = useDebouncedCallback((values: BlogCategoriesSearchForm) => setQuery(formValuesToQuery(values)), 300);

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
              placeholder="Search blog categories..."
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
