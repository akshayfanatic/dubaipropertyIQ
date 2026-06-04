'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { MapPin } from 'lucide-react';
import { WidgetCard } from '@/components/shared/WidgetCard';
import { FormActions } from '@/components/shared/forms/FormActions';
import { LocationPicker } from '@/components/shared/location/LocationPicker';
import { DEFAULT_LOCATION, locationSchema } from '@/components/shared/location/schema';
import { updateBuilding } from '@/lib/db/buildings/actions';
import type { Location } from '@/types/shared';
import { z } from 'zod';

const buildingLocationSchema = z.object({
  location: locationSchema,
});

type BuildingLocationData = z.infer<typeof buildingLocationSchema>;

interface BuildingLocationProps {
  buildingId?: string;
  location?: Location | null;
}

function BuildingLocation({ buildingId, location }: BuildingLocationProps) {
  const form = useForm<BuildingLocationData>({
    resolver: zodResolver(buildingLocationSchema),
    defaultValues: {
      location: location ?? DEFAULT_LOCATION,
    },
  });

  const onSubmit = async (data: BuildingLocationData) => {
    if (!buildingId) {
      toast.error('Please save the building basic info first');
      return;
    }

    const result = await updateBuilding(buildingId, { location: data.location });

    if (!result.success) {
      toast.error(result.message || 'Failed to save location');
      return;
    }

    toast.success('Location saved successfully');
  };

  return (
    <WidgetCard>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Controller
          name="location"
          control={form.control}
          render={({ field }) => (
            <div className="space-y-2">
              <LocationPicker value={field.value} onPositionChange={field.onChange} showCoordinates showUseMyLocation showSaveButton={false} />
              {form.formState.errors.location && <p className="text-sm text-destructive">Please select a valid building location.</p>}
            </div>
          )}
        />
        <FormActions isSubmitting={form.formState.isSubmitting} isEditMode={!!buildingId} submitLabel="Location" />
      </form>
    </WidgetCard>
  );
}

export default BuildingLocation;
