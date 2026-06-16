'use client';

import { useFormContext } from 'react-hook-form';
import { usePathname } from 'next/navigation';
import { useQueryStates } from 'nuqs';
import { RotateCcw, Sparkles, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BaseForm from '@/components/shared/forms/BaseForm';
import { FormField, FormItem, FormControl, FormLabel } from '@/components/ui/form';
import { MultiSelect } from '@/components/ui/multi-select';
import { SelectField } from '@/components/shared/select-field';
import { Switch } from '@/components/ui/switch';
import { useAreas } from '@/hooks/data/public/useAreas';
import { useAmenities } from '@/hooks/data/public/useAmenities';
import { useDevelopers } from '@/hooks/data/public/useDevelopers';
import { z } from 'zod';
import { filterValuesToQuery, queryToFilterValues, searchQueryParsers } from './types';
import { PROPERTY_STATUS_LABELS, type PropertyStatus } from '@/types/enums';

const PUBLIC_STATUS_OPTIONS: Array<{ label: string; value: PropertyStatus }> = [
  { label: PROPERTY_STATUS_LABELS.available, value: 'available' },
  { label: PROPERTY_STATUS_LABELS.reserved, value: 'reserved' },
  { label: PROPERTY_STATUS_LABELS.off_plan, value: 'off_plan' },
];

const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price low-high', value: 'price_asc' },
  { label: 'Price high-low', value: 'price_desc' },
  { label: 'Most popular', value: 'popular' },
];

const sidebarFilterSchema = z.object({
  status: z.string().optional(),
  sort: z.string().optional(),
  areas: z.array(z.string()).optional(),
  developerId: z.string().optional(),
  amenities: z.array(z.string()).optional(),
  goldenVisaEligible: z.boolean().optional(),
});

type SidebarFilterValues = z.infer<typeof sidebarFilterSchema>;

export default function SidebarFilters() {
  const { areas } = useAreas();
  const { amenities } = useAmenities();
  const { developers, isLoading: developersLoading } = useDevelopers();

  const [query] = useQueryStates(searchQueryParsers, {
    shallow: false,
    history: 'replace',
  });
  const filterValues = queryToFilterValues(query);

  const defaultValues: SidebarFilterValues = {
    status: filterValues.status,
    sort: filterValues.sort,
    areas: filterValues.areas,
    developerId: filterValues.developerId,
    amenities: filterValues.amenities,
    goldenVisaEligible: filterValues.goldenVisaEligible,
  };

  return (
    <BaseForm schema={sidebarFilterSchema} onSubmit={() => {}} defaultValues={defaultValues}>
      <FilterFields areas={areas} amenities={amenities} developers={developers} developersLoading={developersLoading} />
    </BaseForm>
  );
}

interface FilterFieldsProps {
  areas: Array<{ value: string; label: string }>;
  amenities: Array<{ value: string; label: string }>;
  developers: Array<{ value: string; label: string }>;
  developersLoading: boolean;
}

function FilterFields({ areas, amenities, developers, developersLoading }: FilterFieldsProps) {
  const pathname = usePathname();
  const showGoldenVisaFilter = pathname !== '/golden-visa-properties';
  const form = useFormContext<SidebarFilterValues>();
  const [query, setQuery] = useQueryStates(searchQueryParsers, {
    shallow: false,
    history: 'replace',
  });

  const updateUrl = (data: SidebarFilterValues) => {
    const currentValues = queryToFilterValues(query);
    setQuery(
      filterValuesToQuery({
        ...currentValues,
        status: data.status,
        sort: data.sort,
        areas: data.areas,
        developerId: data.developerId,
        amenities: data.amenities,
        goldenVisaEligible: data.goldenVisaEligible,
      }),
    );
  };

  const handleReset = () => {
    form.reset({ status: '', sort: '', areas: [], developerId: '', amenities: [], goldenVisaEligible: false });
    setQuery({
      ...filterValuesToQuery({ location: '', propertyType: '', bedrooms: '', status: '', sort: '', areas: [], developerId: '', priceRange: {}, amenities: [], goldenVisaEligible: false }),
      page: null,
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3 rounded-2xl bg-muted/45 p-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <SlidersHorizontal className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-semibold leading-6 text-foreground">Refine search</h2>
            <p className="text-sm leading-5 text-muted-foreground">{showGoldenVisaFilter ? 'Amenities and eligibility' : 'Areas and amenities'}</p>
          </div>
        </div>
      </div>

      {/* PROPERTY STATUS */}
      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <SelectField
                placeholder="Property status"
                options={PUBLIC_STATUS_OPTIONS}
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value);
                  updateUrl({ ...form.getValues(), status: value });
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />

      {/* SORT */}
      <FormField
        control={form.control}
        name="sort"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <SelectField
                placeholder="Sort by"
                options={SORT_OPTIONS}
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value);
                  updateUrl({ ...form.getValues(), sort: value });
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />

      {/* AREAS */}
      <FormField
        control={form.control}
        name="areas"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <MultiSelect
                name="areas"
                placeholder="Any area"
                options={areas}
                value={field.value || []}
                onChange={(val) => {
                  field.onChange(val);
                  updateUrl({ ...form.getValues(), areas: val });
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />

      {/* DEVELOPERS */}
      <FormField
        control={form.control}
        name="developerId"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <SelectField
                placeholder="Any developer"
                options={developers}
                value={field.value}
                disabled={developersLoading}
                onValueChange={(value) => {
                  field.onChange(value);
                  updateUrl({ ...form.getValues(), developerId: value });
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />

      {/* AMENITIES */}
      <FormField
        control={form.control}
        name="amenities"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <MultiSelect
                name="amenities"
                placeholder="Any amenity"
                options={amenities}
                value={field.value || []}
                onChange={(val) => {
                  field.onChange(val);
                  updateUrl({ ...form.getValues(), amenities: val });
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />

      {showGoldenVisaFilter && (
        <FormField
          control={form.control}
          name="goldenVisaEligible"
          render={({ field }) => (
            <FormItem className="rounded-2xl border border-border bg-background p-4 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
                    <Sparkles className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <FormLabel className="cursor-pointer text-sm font-medium leading-5 text-foreground">Golden Visa eligible</FormLabel>
                    <p className="text-xs leading-5 text-muted-foreground">Show properties qualifying for UAE residency.</p>
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value || false}
                    onCheckedChange={(val) => {
                      field.onChange(val);
                      updateUrl({ ...form.getValues(), goldenVisaEligible: val });
                    }}
                  />
                </FormControl>
              </div>
            </FormItem>
          )}
        />
      )}

      {/* RESET FILTERS */}
      <Button type="button" onClick={handleReset} className="h-11 w-full gap-2 rounded-xl font-bold shadow-sm shadow-primary/20">
        <RotateCcw className="h-4 w-4" />
        Reset filters
      </Button>
    </div>
  );
}
