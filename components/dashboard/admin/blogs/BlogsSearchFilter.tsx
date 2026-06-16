'use client';

import { Controller, FormProvider, useForm } from 'react-hook-form';
import { parseAsArrayOf, parseAsString, useQueryStates } from 'nuqs';
import useSWR from 'swr';
import { useDebouncedCallback } from 'use-debounce';
import { FilterFieldSet } from '@/components/shared/forms/filter-fieldset';
import { ResetButton } from '@/components/shared/forms/reset-button';
import { SearchInput } from '@/components/shared/forms/search-input';
import { SelectField } from '@/components/shared/select-field';
import { MultiSelect } from '@/components/ui/multi-select';
import type { BlogCategoryOption } from '@/types/blog-category';
import type { BlogTagOption } from '@/types/blog-tag';
import type { SelectOption } from '@/types/shared';

interface BlogsSearchForm {
  search: string;
  category_id: string;
  tag_ids: string[];
  status: string;
}

const blogsSearchParsers = {
  search: parseAsString.withDefault(''),
  category_id: parseAsString.withDefault(''),
  tag_ids: parseAsArrayOf(parseAsString).withDefault([]),
  status: parseAsString.withDefault(''),
  page: parseAsString.withDefault('1'),
};

const statusOptions: SelectOption[] = [
  { label: 'All Statuses', value: 'all' },
  { label: 'Published', value: 'published' },
  { label: 'Draft', value: 'draft' },
];

export function BlogsSearchFilter() {
  const { data: categories = [], isLoading: isLoadingCategories } = useSWR<BlogCategoryOption[]>('/api/admin/blogs/categories/options');
  const { data: tags = [], isLoading: isLoadingTags } = useSWR<BlogTagOption[]>('/api/admin/blogs/tags/options');
  const [query, setQuery] = useQueryStates(blogsSearchParsers, {
    shallow: false,
    history: 'replace',
  });

  const methods = useForm<BlogsSearchForm>({
    defaultValues: {
      search: query.search,
      category_id: query.category_id,
      tag_ids: query.tag_ids,
      status: query.status,
    },
  });

  const { control, reset } = methods;
  const updateQuery = useDebouncedCallback((values: BlogsSearchForm) => {
    setQuery({
      search: values.search || null,
      category_id: values.category_id && values.category_id !== 'all' ? values.category_id : null,
      tag_ids: values.tag_ids.length ? values.tag_ids : null,
      status: values.status && values.status !== 'all' ? values.status : null,
      page: null,
    });
  }, 300);
  const categoryOptions: SelectOption[] = [{ label: 'All Categories', value: 'all' }, ...categories];
  const tagOptions = tags.map((tag) => ({ label: tag.label, value: tag.value }));

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

        <Controller
          name="tag_ids"
          control={control}
          render={({ field }) => (
            <MultiSelect
              name="tag_ids"
              options={tagOptions}
              value={field.value}
              onChange={(value) => {
                field.onChange(value);
                updateQuery({ ...methods.getValues(), tag_ids: value });
              }}
              placeholder="Tags"
              disabled={isLoadingTags}
              isLoading={isLoadingTags}
              className="w-full sm:w-72"
            />
          )}
        />

        <ResetButton
          onReset={() => {
            const emptyValues = { search: '', category_id: '', tag_ids: [], status: '' };
            reset(emptyValues);
            setQuery({ search: null, category_id: null, tag_ids: null, status: null, page: null });
          }}
        />
      </FilterFieldSet>
    </FormProvider>
  );
}
