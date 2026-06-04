'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { z } from 'zod';
import { Star } from 'lucide-react';
import { WidgetCard } from '@/components/shared/WidgetCard';
import { FormActions } from '@/components/shared/forms/FormActions';
import { TextArea } from '@/components/shared/forms/text-area';
import { buildingSchema } from '@/lib/validations/building';
import { updateBuilding } from '@/lib/db/buildings/actions';
import { listText, splitList } from './BuildingFormFields';

const buildingProsConsSchema = buildingSchema.pick({
  pros: true,
  cons: true,
});

type BuildingProsConsData = z.input<typeof buildingProsConsSchema>;

interface BuildingProsConsProps {
  buildingId?: string;
  pros?: BuildingProsConsData['pros'];
  cons?: BuildingProsConsData['cons'];
}

function BuildingProsCons({ buildingId, pros, cons }: BuildingProsConsProps) {
  const form = useForm<BuildingProsConsData>({
    resolver: zodResolver(buildingProsConsSchema),
    defaultValues: {
      pros: pros ?? [],
      cons: cons ?? [],
    },
  });

  const onSubmit = async (data: BuildingProsConsData) => {
    if (!buildingId) {
      toast.error('Please save the building basic info first');
      return;
    }

    const result = await updateBuilding(buildingId, {
      pros: data.pros ?? [],
      cons: data.cons ?? [],
    });

    if (!result.success) {
      toast.error(result.message || 'Failed to save pros and cons');
      return;
    }

    toast.success('Pros and cons saved successfully');
  };

  return (
    <WidgetCard icon={Star} title="Pros & Cons" description="Short comma-separated points for investor decision sections.">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Controller
            name="pros"
            control={form.control}
            render={({ field }) => (
              <TextArea label="Pros" placeholder="One per line or comma-separated list" rows={4} value={listText(field.value)} onChange={(e) => field.onChange(splitList(e.target.value))} />
            )}
          />
          <Controller
            name="cons"
            control={form.control}
            render={({ field }) => (
              <TextArea label="Cons" placeholder="One per line or comma-separated list" rows={4} value={listText(field.value)} onChange={(e) => field.onChange(splitList(e.target.value))} />
            )}
          />
        </div>
        <FormActions isSubmitting={form.formState.isSubmitting} isEditMode={!!buildingId} submitLabel="Pros & Cons" />
      </form>
    </WidgetCard>
  );
}

export default BuildingProsCons;
