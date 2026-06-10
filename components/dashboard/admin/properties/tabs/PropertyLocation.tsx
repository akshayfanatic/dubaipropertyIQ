'use client';

import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { LocationPicker } from '@/components/shared/location/LocationPicker';
import type { Location } from '@/types/shared';
import { toast } from 'sonner';
import { updatePropertyLocation } from '@/lib/db/properties/actions';
import { WidgetCard } from '@/components/shared/WidgetCard';
import { locationSchema } from '@/components/shared/location/schema';

const DEFAULT_LOCATION: Location = { lat: 25.0657, lng: 55.17128 };

interface PropertyLocationProps {
  propertyId?: string;
  location?: Location | null;
}

export function PropertyLocation({ propertyId, location }: PropertyLocationProps) {
  const form = useForm<Location>({
    resolver: zodResolver(locationSchema),
    defaultValues: location || DEFAULT_LOCATION,
  });
  const lng = useWatch({
    control: form.control,
    name: 'lng',
  });

  const onSubmit = async (data: Location) => {
    if (!propertyId) {
      toast.error('Cannot save location', {
        description: 'Please save the property basic info first.',
      });
      return;
    }

    const result = await updatePropertyLocation(propertyId, data);

    if (result.success) {
      toast.success('Location saved successfully', {
        description: `Lat: ${data.lat.toFixed(5)}, Lng: ${data.lng.toFixed(5)}`,
      });
    } else {
      toast.error('Failed to save location', {
        description: result.message,
      });
    }
  };

  return (
    <WidgetCard className="py-6">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Controller
          name="lat"
          control={form.control}
          render={({ field }) => (
            <LocationPicker
              value={{ lat: field.value, lng }}
              onPositionChange={(pos) => {
                field.onChange(pos.lat);
                form.setValue('lng', pos.lng);
              }}
              showCoordinates
              showUseMyLocation
              showSaveButton={false}
            />
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Saving...' : 'Save Location'}
        </Button>

        {(form.formState.errors.lat || form.formState.errors.lng) && <p className="text-sm text-destructive">Please select a valid location</p>}
      </form>
    </WidgetCard>
  );
}

export default PropertyLocation;
