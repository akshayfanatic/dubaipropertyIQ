'use client';

import { Controller, FormProvider, useForm } from 'react-hook-form';
import { parseAsString, useQueryStates } from 'nuqs';
import useSWR from 'swr';
import { useDebouncedCallback } from 'use-debounce';
import { FilterFieldSet } from '@/components/shared/forms/filter-fieldset';
import { ResetButton } from '@/components/shared/forms/reset-button';
import { SearchInput } from '@/components/shared/forms/search-input';
import { SelectField } from '@/components/shared/select-field';
import type { BlogCategoryOption } from '@/types/blog-category';
import type { SelectOption } from '@/types/shared';

interface BlogsSearchForm {
  search: string;
  category_id: string;
  status: string;
}

const blogsSearchParsers = {
  search: parseAsString.withDefault(''),
  category_id: parseAsString.withDefault(''),
  status: parseAsString.withDefault(''),
  page: parseAsString.withDefault('1'),
};

const queryToFormValues = (query: Omit<Record<keyof typeof blogsSearchParsers, string>, 'page'>): BlogsSearchForm => ({
  search: query.search,
  category_id: query.category_id,
  status: query.status,
});

const formValuesToQuery = (values: BlogsSearchForm) => ({
  search: values.search || null,
  category_id: values.category_id && values.category_id !== 'all' ? values.category_id : null,
  status: values.status && values.status !== 'all' ? values.status : null,
  page: null,
});

const statusOptions: SelectOption[] = [
  { label: 'All Statuses', value: 'all' },
  { label: 'Published', value: 'published' },
  { label: 'Draft', value: 'draft' },
];

export function BlogsSearchFilter() {
  const { data: categories = [], isLoading: isLoadingCategories } = useSWR<BlogCategoryOption[]>('/api/admin/blog-categories/options');
  const [query, setQuery] = useQueryStates(blogsSearchParsers, {
    shallow: false,
    history: 'replace',
  });

  const methods = useForm<BlogsSearchForm>({
    defaultValues: queryToFormValues(query),
  });

  const { control, reset } = methods;
  const updateQuery = useDebouncedCallback((values: BlogsSearchForm) => setQuery(formValuesToQuery(values)), 300);
  const categoryOptions: SelectOption[] = [{ label: 'All Categories', value: 'all' }, ...categories];

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
              placeholder="Search blogs..."
              className="max-w-sm"
            />
          )}
        />

        <Controller
          name="category_id"
          control={control}
          render={({ field }) => (
            <SelectField
              options={categoryOptions}
              placeholder={isLoadingCategories ? 'Loading categories...' : 'Category'}
              value={field.value}
              onValueChange={(value) => {
                field.onChange(value);
                updateQuery({ ...methods.getValues(), category_id: value });
              }}
              className="w-52"
              disabled={isLoadingCategories}
            />
          )}
        />

        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <SelectField
              options={statusOptions}
              placeholder="Status"
              value={field.value}
              onValueChange={(value) => {
                field.onChange(value);
                updateQuery({ ...methods.getValues(), status: value });
              }}
              className="w-40"
            />
          )}
        />

        <ResetButton
          onReset={() => {
            const emptyValues = { search: '', category_id: '', status: '' };
            reset(emptyValues);
            setQuery(formValuesToQuery(emptyValues));
          }}
        />
      </FilterFieldSet>
    </FormProvider>
  );
}
