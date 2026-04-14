'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { LocationPicker } from '@/components/shared/location/LocationPicker';
import { locationFormSchema, type Location, type LocationValue, DEFAULT_LOCATION } from '@/components/shared/location/schema';
import { toast } from 'sonner';
import { updatePropertyLocation } from '@/lib/db/properties/actions';

interface PropertyLocationProps {
  propertyId?: string;
  location?: LocationValue | null;
}

export function PropertyLocation({ propertyId, location }: PropertyLocationProps) {
  const form = useForm<Location>({
    resolver: zodResolver(locationFormSchema),
    defaultValues: {
      location: location || DEFAULT_LOCATION,
    },
  });

  const onSubmit = async (data: Location) => {
    if (!propertyId) {
      toast.error('Cannot save location', {
        description: 'Please save the property basic info first.',
      });
      return;
    }

    if (!data.location) {
      toast.error('Invalid location', {
        description: 'Please select a valid location on the map.',
      });
      return;
    }

    const result = await updatePropertyLocation(propertyId, data.location);

    if (result.success) {
      toast.success('Location saved successfully', {
        description: `Lat: ${data.location.lat.toFixed(5)}, Lng: ${data.location.lng.toFixed(5)}`,
      });
    } else {
      toast.error('Failed to save location', {
        description: result.message,
      });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Controller
        name="location"
        control={form.control}
        render={({ field }) => <LocationPicker value={field.value || DEFAULT_LOCATION} onPositionChange={field.onChange} showCoordinates showUseMyLocation showSaveButton={false} />}
      />

      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? 'Saving...' : 'Save Location'}
      </Button>

      {form.formState.errors.location && <p className="text-sm text-destructive">{form.formState.errors.location?.message as string}</p>}
    </form>
  );
}

export default PropertyLocation;
