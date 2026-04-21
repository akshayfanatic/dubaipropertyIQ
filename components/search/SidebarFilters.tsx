'use client';

import { useFormContext, useWatch } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { X, Sparkles, RotateCcw, Building2, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BaseForm from '@/components/shared/forms/BaseForm';
import { FormField, FormItem, FormControl, FormLabel } from '@/components/ui/form';
import { MultiSelect } from '@/components/ui/multi-select';
import { Switch } from '@/components/ui/switch';
import { useAmenities } from '@/hooks/data/public/useAmenities';
import { useClient } from '@/hooks/use-client';
import { z } from 'zod';
import { useState } from 'react';

const sidebarFilterSchema = z.object({
  amenities: z.array(z.string()).optional(),
  goldenVisaEligible: z.boolean().optional(),
});

type SidebarFilterValues = z.infer<typeof sidebarFilterSchema>;

export default function SidebarFilters() {
  const isClient = useClient();
  const searchParams = useSearchParams();
  const { amenities } = useAmenities();

  if (isClient) {
    const defaultValues: SidebarFilterValues = {
      amenities: searchParams.get('amenities')?.split(',') || [],
      goldenVisaEligible: searchParams.get('golden_visa_eligible') === 'true',
    };

    return (
      <BaseForm schema={sidebarFilterSchema} onSubmit={() => {}} defaultValues={defaultValues}>
        <FilterFields amenities={amenities} />
      </BaseForm>
    );
  }
}

interface FilterFieldsProps {
  amenities: Array<{ value: string; label: string }>;
}

function FilterFields({ amenities }: FilterFieldsProps) {
  const form = useFormContext<SidebarFilterValues>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isResetting, setIsResetting] = useState(false);

  const formValues = useWatch({ control: form.control });

  const hasActiveFilters = (formValues.amenities && formValues.amenities.length > 0) || formValues.goldenVisaEligible === true;

  const updateUrl = (data: SidebarFilterValues) => {
    const params = new URLSearchParams(searchParams.toString());
    if (data.amenities?.length) {
      params.set('amenities', data.amenities.join(','));
    } else {
      params.delete('amenities');
    }
    if (data.goldenVisaEligible) {
      params.set('golden_visa_eligible', 'true');
    } else {
      params.delete('golden_visa_eligible');
    }
    router.push(`/search?${params.toString()}`);
  };

  const handleReset = async () => {
    setIsResetting(true);
    form.reset({ amenities: [], goldenVisaEligible: false });
    router.push('/search');
    setTimeout(() => setIsResetting(false), 500);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 pb-2 border-b">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
          <Filter className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-base">Filters</h3>
          <p className="text-xs text-muted-foreground">Narrow down your search</p>
        </div>
      </div>

      {/* Amenities */}
      <FormField
        control={form.control}
        name="amenities"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <MultiSelect
                name="amenities"
                placeholder="Select amenities..."
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

      {/* Golden Visa */}
      <FormField
        control={form.control}
        name="goldenVisaEligible"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between rounded-lg border bg-card p-3 hover:bg-muted/50 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10">
                <Sparkles className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="space-y-0.5">
                <FormLabel className="font-medium cursor-pointer text-sm">Golden Visa Eligible</FormLabel>
                <p className="text-xs text-muted-foreground">Properties qualifying for UAE residency</p>
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
          </FormItem>
        )}
      />

      {/* Reset */}
      {hasActiveFilters && (
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          disabled={isResetting}
          className="w-full gap-2 border-destructive/50 text-destructive hover:bg-destructive/10 hover:border-destructive transition-all"
        >
          {isResetting ? <RotateCcw className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
          {isResetting ? 'Clearing...' : 'Clear all filters'}
        </Button>
      )}
    </div>
  );
}
