'use client';

import { Controller, FormProvider, useForm } from 'react-hook-form';
import { parseAsString, useQueryStates } from 'nuqs';
import { useDebouncedCallback } from 'use-debounce';
import { FilterFieldSet } from '@/components/shared/forms/filter-fieldset';
import { ResetButton } from '@/components/shared/forms/reset-button';
import { SearchInput } from '@/components/shared/forms/search-input';
import { SelectField } from '@/components/shared/select-field';
import { LEAD_SOURCE_TYPES, LEAD_STATUSES } from '@/types/lead';

interface LeadsSearchForm {
  search: string;
  sourceType: string;
  status: string;
}

const leadsSearchParsers = {
  search: parseAsString.withDefault(''),
  sourceType: parseAsString.withDefault(''),
  status: parseAsString.withDefault(''),
  page: parseAsString.withDefault('1'),
};

const sourceLabels: Record<string, string> = {
  newsletter: 'Newsletter',
  property: 'Property',
  developer: 'Developer',
  area: 'Area',
  calculator: 'Calculator',
  golden_visa: 'Golden Visa',
  callback: 'Callback',
  whatsapp: 'WhatsApp',
  blog: 'Blog',
  pdf_download: 'PDF Download',
};

const queryToFormValues = (query: Omit<Record<keyof typeof leadsSearchParsers, string>, 'page'>): LeadsSearchForm => ({
  search: query.search,
  sourceType: query.sourceType,
  status: query.status,
});

const formValuesToQuery = (values: LeadsSearchForm) => ({
  search: values.search || null,
  sourceType: values.sourceType && values.sourceType !== 'all' ? values.sourceType : null,
  status: values.status && values.status !== 'all' ? values.status : null,
  page: null,
});

export function LeadsSearchFilter() {
  const [query, setQuery] = useQueryStates(leadsSearchParsers, {
    shallow: false,
    history: 'replace',
  });

  const methods = useForm<LeadsSearchForm>({
    defaultValues: queryToFormValues(query),
  });

  const { control, reset } = methods;
  const updateQuery = useDebouncedCallback((values: LeadsSearchForm) => setQuery(formValuesToQuery(values)), 300);

  const sourceOptions = [
    { label: 'All Sources', value: 'all' },
    ...LEAD_SOURCE_TYPES.map((sourceType) => ({
      label: sourceLabels[sourceType] || sourceType.replaceAll('_', ' '),
      value: sourceType,
    })),
  ];

  const statusOptions = [
    { label: 'All Statuses', value: 'all' },
    ...LEAD_STATUSES.map((status) => ({
      label: status.charAt(0).toUpperCase() + status.slice(1),
      value: status,
    })),
  ];

  return (
    <FormProvider {...methods}>
      <FilterFieldSet>
        {/* Search field - filters leads by name, email, phone, or message */}
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
              placeholder="Search leads..."
              className="max-w-sm"
            />
          )}
        />

        {/* Source field - filters leads by capture source such as property, calculator, or Golden Visa */}
        <Controller
          name="sourceType"
          control={control}
          render={({ field }) => (
            <SelectField
              options={sourceOptions}
              placeholder="Source"
              value={field.value}
              onValueChange={(value) => {
                field.onChange(value);
                updateQuery({ ...methods.getValues(), sourceType: value });
              }}
              className="w-48"
            />
          )}
        />

        {/* Status field - filters leads by current admin follow-up status */}
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
              className="w-44"
            />
          )}
        />
        <ResetButton
          onReset={() => {
            const emptyValues = { search: '', sourceType: '', status: '' };
            reset(emptyValues);
            setQuery(formValuesToQuery(emptyValues));
          }}
        />
      </FilterFieldSet>
    </FormProvider>
  );
}
