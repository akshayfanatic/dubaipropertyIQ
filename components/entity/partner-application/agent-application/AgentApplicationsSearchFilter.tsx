'use client';

import { Controller, FormProvider, useForm } from 'react-hook-form';
import { parseAsString, useQueryStates } from 'nuqs';
import { useDebouncedCallback } from 'use-debounce';
import { FilterFieldSet } from '@/components/shared/forms/filter-fieldset';
import { ResetButton } from '@/components/shared/forms/reset-button';
import { SearchInput } from '@/components/shared/forms/search-input';
import { SelectField } from '@/components/shared/select-field';
import { PARTNER_APPLICATION_STATUS_FILTER_OPTIONS } from '@/config/application';

interface AgentApplicationsSearchForm {
  search: string;
  status: string;
}

const agentApplicationsSearchParsers = {
  search: parseAsString.withDefault(''),
  status: parseAsString.withDefault(''),
  page: parseAsString.withDefault('1'),
};

export function AgentApplicationsSearchFilter() {
  const [query, setQuery] = useQueryStates(agentApplicationsSearchParsers, {
    shallow: false,
    history: 'replace',
  });

  const methods = useForm<AgentApplicationsSearchForm>({
    defaultValues: {
      search: query.search,
      status: query.status,
    },
  });

  const { control, reset } = methods;
  const updateQuery = useDebouncedCallback((values: AgentApplicationsSearchForm) => {
    setQuery({
      search: values.search || null,
      status: values.status && values.status !== 'all' ? values.status : null,
      page: null,
    });
  }, 300);

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
              placeholder="Search applications..."
              className="max-w-sm"
            />
          )}
        />

        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <SelectField
              options={PARTNER_APPLICATION_STATUS_FILTER_OPTIONS}
              placeholder="Status"
              value={field.value}
              onValueChange={(value) => {
                field.onChange(value);
                updateQuery({ ...methods.getValues(), status: value });
              }}
              className="w-44"
            />
          )}
        />

        <ResetButton
          onReset={() => {
            reset({ search: '', status: '' });
            setQuery({ search: null, status: null, page: null });
          }}
        />
      </FilterFieldSet>
    </FormProvider>
  );
}
