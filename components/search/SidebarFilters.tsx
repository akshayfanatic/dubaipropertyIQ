'use client';

import { useFormContext } from 'react-hook-form';
import { useQueryStates } from 'nuqs';
import { BadgeCheck, RotateCcw, Sparkles, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BaseForm from '@/components/shared/forms/BaseForm';
import { FormField, FormItem, FormControl, FormLabel } from '@/components/ui/form';
import { MultiSelect } from '@/components/ui/multi-select';
import { Switch } from '@/components/ui/switch';
import { useAmenities } from '@/hooks/data/public/useAmenities';
import { z } from 'zod';
import { filterValuesToQuery, queryToFilterValues, searchQueryParsers } from './types';

const sidebarFilterSchema = z.object({
  amenities: z.array(z.string()).optional(),
  goldenVisaEligible: z.boolean().optional(),
});

type SidebarFilterValues = z.infer<typeof sidebarFilterSchema>;

export default function SidebarFilters() {
  const { amenities } = useAmenities();
  const [query] = useQueryStates(searchQueryParsers, {
    shallow: false,
    history: 'replace',
  });
  const filterValues = queryToFilterValues(query);

  const defaultValues: SidebarFilterValues = {
    amenities: filterValues.amenities,
    goldenVisaEligible: filterValues.goldenVisaEligible,
  };

  return (
    <BaseForm schema={sidebarFilterSchema} onSubmit={() => {}} defaultValues={defaultValues}>
      <FilterFields amenities={amenities} />
    </BaseForm>
  );
}

interface FilterFieldsProps {
  amenities: Array<{ value: string; label: string }>;
}

function FilterFields({ amenities }: FilterFieldsProps) {
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
        amenities: data.amenities,
        goldenVisaEligible: data.goldenVisaEligible,
      }),
    );
  };

  const handleReset = () => {
    form.reset({ amenities: [], goldenVisaEligible: false });
    setQuery(filterValuesToQuery({ location: '', propertyType: '', priceRange: {}, amenities: [], goldenVisaEligible: false }));
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
            <p className="text-sm leading-5 text-muted-foreground">Amenities and eligibility</p>
          </div>
        </div>
      </div>

      <FormField
        control={form.control}
        name="amenities"
        render={({ field }) => (
          <FormItem className="rounded-2xl border border-border bg-background p-4 shadow-sm">
            <div className="space-y-1">
              <FormLabel className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <BadgeCheck className="size-4 text-primary" />
                Amenities
              </FormLabel>
              <p className="text-xs leading-5 text-muted-foreground">Choose nearby lifestyle, commute, or building features.</p>
            </div>
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

      <Button type="button" onClick={handleReset} className="h-11 w-full gap-2 rounded-xl font-bold shadow-sm shadow-primary/20">
        <RotateCcw className="h-4 w-4" />
        Reset filters
      </Button>
    </div>
  );
}
