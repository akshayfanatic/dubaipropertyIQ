'use client';

import { useFormContext, useWatch } from 'react-hook-form';
import { useQueryStates, parseAsArrayOf, parseAsBoolean, parseAsString } from 'nuqs';
import { X, Sparkles, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BaseForm from '@/components/shared/forms/BaseForm';
import { FormField, FormItem, FormControl, FormLabel } from '@/components/ui/form';
import { MultiSelect } from '@/components/ui/multi-select';
import { Switch } from '@/components/ui/switch';
import { useAmenities } from '@/hooks/data/public/useAmenities';
import { z } from 'zod';
import { useState } from 'react';

const sidebarFilterSchema = z.object({
  amenities: z.array(z.string()).optional(),
  goldenVisaEligible: z.boolean().optional(),
});

type SidebarFilterValues = z.infer<typeof sidebarFilterSchema>;

export default function SidebarFilters() {
  const { amenities } = useAmenities();
  const [query] = useQueryStates(
    {
      amenities: parseAsArrayOf(parseAsString).withDefault([]),
      golden_visa_eligible: parseAsBoolean.withDefault(false),
    },
    {
      shallow: false,
      history: 'replace',
    },
  );

  const defaultValues: SidebarFilterValues = {
    amenities: query.amenities,
    goldenVisaEligible: query.golden_visa_eligible,
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
  const [isResetting, setIsResetting] = useState(false);
  const [, setQuery] = useQueryStates(
    {
      amenities: parseAsArrayOf(parseAsString).withDefault([]),
      golden_visa_eligible: parseAsBoolean.withDefault(false),
    },
    {
      shallow: false,
      history: 'replace',
    },
  );

  const formValues = useWatch({ control: form.control });

  const hasActiveFilters = (formValues.amenities?.length ?? 0) > 0 || formValues.goldenVisaEligible === true;

  const updateUrl = (data: SidebarFilterValues) => {
    setQuery({
      amenities: data.amenities?.length ? data.amenities : null,
      golden_visa_eligible: data.goldenVisaEligible || null,
    });
  };

  const handleReset = async () => {
    setIsResetting(true);
    form.reset({ amenities: [], goldenVisaEligible: false });
    await setQuery({
      amenities: null,
      golden_visa_eligible: null,
    });
    setTimeout(() => setIsResetting(false), 500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3 border-b pb-4">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
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
          <FormItem className="space-y-3">
            <div className="space-y-1">
              <FormLabel className="text-sm font-medium text-foreground">Amenities</FormLabel>
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
          <FormItem className="border-t pt-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
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

      {hasActiveFilters && (
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          disabled={isResetting}
          className="h-10 w-full gap-2 border-destructive/40 text-destructive transition-colors hover:border-destructive hover:bg-destructive/10"
        >
          {isResetting ? <RotateCcw className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
          {isResetting ? 'Clearing...' : 'Clear all filters'}
        </Button>
      )}
    </div>
  );
}
