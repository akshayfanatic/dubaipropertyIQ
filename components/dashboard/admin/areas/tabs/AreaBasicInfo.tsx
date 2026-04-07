'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@/components/ui/label';
import { ImageUploader } from '@/components/ui/image-uploader';
import { SelectField } from '@/components/shared/select-field';
import { FormActions } from '@/components/shared/forms/FormActions';
import { TextInput } from '@/components/shared/forms/text-input';
import { TextArea } from '@/components/shared/forms/text-area';
import { MultiSelect } from '@/components/ui/multi-select';
import { fetcher, generateSlug } from '@/lib/utils';
import { CityOption } from '@/types/city';
import { Area } from '@/types/areas';
import { createArea, updateArea, updateAreaAmenities, updateAreaProperties } from '@/lib/db/areas/actions';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { areaSchema, AreaFormData } from '@/lib/validations/area';
import useSWR from 'swr';
import { useMemo } from 'react';
import { AmenityOption } from '@/types/amenities';
import { PropertyOption } from '@/types/property';

interface AreaBasicInfoProps {
  area?: Area & {
    cities?: { name: string } | null;
    areas_amenities?: Array<{ amenity_id: string }>;
    areas_properties?: Array<{ property_id: string }>;
  };
}

function AreaBasicInfo({ area }: AreaBasicInfoProps) {
  const isEditMode = !!area;

  const router = useRouter();
  const { data: cityOptions, isLoading: isLoadingCities } = useSWR<CityOption[]>('/api/admin/cities/options', fetcher);
  const { data: amenityResponse, isLoading: isLoadingAmenities } = useSWR<{ success: boolean; data: AmenityOption[] }>('/api/admin/amenities/options', fetcher);
  const { data: propertyResponse, isLoading: isLoadingProperties } = useSWR<{ success: boolean; data: PropertyOption[] }>('/api/admin/properties/options', fetcher);
  const amenityOptions = amenityResponse?.data || [];
  const propertyOptions = propertyResponse?.data || [];

  // Extract amenity IDs from area data
  const areaAmenityIds = useMemo(() => {
    return area?.areas_amenities?.map((a) => a.amenity_id) || [];
  }, [area?.areas_amenities]);

  // Extract property IDs from area data
  const areaPropertyIds = useMemo(() => {
    return area?.areas_properties?.map((p) => p.property_id) || [];
  }, [area?.areas_properties]);

  const form = useForm<AreaFormData>({
    resolver: zodResolver(areaSchema),
    defaultValues: {
      city_id: area?.city_id || '',
      name: area?.name || '',
      slug: area?.slug || '',
      description: area?.description || '',
      photos: area?.photos || [],
      amenity_ids: areaAmenityIds,
      property_ids: areaPropertyIds,
    },
  });

  const onSubmit = async (data: AreaFormData) => {
    try {
      const { amenity_ids, property_ids, ...areaData } = data;
      const result = isEditMode ? await updateArea(area!.id, areaData) : await createArea(areaData);

      if (!result?.success) {
        toast.error(result?.message || 'Failed to save area');
        return;
      }

      // Handle amenities separately after area is created/updated
      const areaId = isEditMode ? area!.id : (result.data as Area)?.id;
      if (areaId && amenity_ids) {
        const amenitiesResult = await updateAreaAmenities(areaId, amenity_ids);
        if (!amenitiesResult?.success) {
          toast.error('Area saved but failed to update amenities');
        }
      }

      // Handle properties separately after area is created/updated
      if (areaId && property_ids) {
        const propertiesResult = await updateAreaProperties(areaId, property_ids);
        if (!propertiesResult?.success) {
          toast.error('Area saved but failed to update properties');
        }
      }

      toast.success(isEditMode ? 'Area updated successfully' : 'Area created successfully');
      router.push('/dashboard/admin/areas');
      router.refresh();
    } catch {
      toast.error('An unexpected error occurred');
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* City */}
      <Controller
        name="city_id"
        control={form.control}
        render={({ field }) => (
          <div className="grid gap-2">
            <Label htmlFor="city_id">
              City <span className="text-destructive">*</span>
            </Label>
            <SelectField
              options={cityOptions || []}
              placeholder={isLoadingCities ? 'Loading cities...' : 'Select a city'}
              value={field.value}
              onValueChange={field.onChange}
              disabled={isLoadingCities}
            />
            {form.formState.errors.city_id && <p className="text-sm text-destructive">{form.formState.errors.city_id.message as string}</p>}
          </div>
        )}
      />

      {/* Name */}
      <Controller
        name="name"
        control={form.control}
        render={({ field }) => (
          <TextInput
            id="name"
            label="Name"
            required
            placeholder="e.g., Downtown Dubai"
            error={form.formState.errors.name?.message as string}
            value={field.value}
            onChange={field.onChange}
            onBlur={(e) => {
              field.onBlur();
              form.setValue('slug', generateSlug(e.target.value));
            }}
          />
        )}
      />

      {/* Slug */}
      <Controller
        name="slug"
        control={form.control}
        render={({ field }) => (
          <div className="grid gap-2">
            <TextInput id="slug" label="Slug" required placeholder="e.g., downtown-dubai" error={form?.formState?.errors?.slug?.message as string} {...field} />
            <p className="text-xs text-muted-foreground">URL-friendly identifier (lowercase letters, numbers, and hyphens only)</p>
          </div>
        )}
      />

      {/* Amenities */}
      <Controller
        name="amenity_ids"
        control={form.control}
        render={({ field }) => (
          <MultiSelect
            name="amenity_ids"
            label="Amenities"
            placeholder={isLoadingAmenities ? 'Loading amenities...' : 'Select amenities...'}
            options={amenityOptions}
            value={field.value}
            onChange={field.onChange}
            error={form.formState.errors.amenity_ids?.message as string}
            disabled={isLoadingAmenities}
            isLoading={isLoadingAmenities}
          />
        )}
      />

      {/* Properties */}
      <Controller
        name="property_ids"
        control={form.control}
        render={({ field }) => (
          <MultiSelect
            name="property_ids"
            label="Properties"
            placeholder={isLoadingProperties ? 'Loading properties...' : 'Select properties...'}
            options={propertyOptions}
            value={field.value}
            onChange={field.onChange}
            error={form.formState.errors.property_ids?.message as string}
            disabled={isLoadingProperties}
            isLoading={isLoadingProperties}
          />
        )}
      />

      {/* Photos */}
      <Controller
        name="photos"
        control={form.control}
        render={({ field }) => (
          <div className="grid gap-2">
            <Label>Area Photos</Label>
            <ImageUploader
              bucket="area-photos"
              folder="areas"
              value={field.value?.map((url: string) => ({ url, alt_tag: '' })) || []}
              onChange={(urls) => {
                const photoUrls = urls.map((u: { url: string }) => u.url);
                field.onChange(photoUrls);
                form.setValue('photos', photoUrls, { shouldDirty: true, shouldTouch: true });
              }}
              maxImages={10}
              label="Photos"
              accept="image/*"
            />
            <p className="text-xs text-muted-foreground">Upload area photos (JPG, PNG, WebP, max 5MB each, up to 10 photos)</p>
          </div>
        )}
      />

      {/* Description */}
      <Controller
        name="description"
        control={form.control}
        render={({ field }) => <TextArea id="description" label="Description" placeholder="Optional description..." error={form.formState.errors.description?.message as string} rows={3} {...field} />}
      />

      {/* Actions */}
      <FormActions isSubmitting={form.formState.isSubmitting} isEditMode={isEditMode} submitLabel="Area" />
    </form>
  );
}

export default AreaBasicInfo;
