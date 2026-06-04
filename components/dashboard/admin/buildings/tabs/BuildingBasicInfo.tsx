'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { toast } from 'sonner';
import { z } from 'zod';
import { Building2, MapPin } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { ImageUploader } from '@/components/ui/image-uploader';
import { WidgetCard } from '@/components/shared/WidgetCard';
import { FormActions } from '@/components/shared/forms/FormActions';
import { TextInput } from '@/components/shared/forms/text-input';
import { TextArea } from '@/components/shared/forms/text-area';
import { generateSlug } from '@/lib/utils';
import { buildingSchema, type BuildingInsertData } from '@/lib/validations/building';
import { createBuilding, updateBuilding } from '@/lib/db/buildings/actions';
import type { AreaOption } from '@/types/areas';
import type { Building } from '@/types/building';
import type { CityOption } from '@/types/city';
import type { DeveloperOption } from '@/types/developer';
import { SelectGroup } from './BuildingFormFields';

const buildingBasicInfoSchema = buildingSchema.pick({
  city_id: true,
  area_id: true,
  name: true,
  slug: true,
  developer_id: true,
  address: true,
  description: true,
  photos: true,
});

type BuildingBasicInfoData = z.input<typeof buildingBasicInfoSchema>;

interface BuildingBasicInfoProps {
  buildingId?: string;
  area_id?: BuildingBasicInfoData['area_id'];
  city_id?: BuildingBasicInfoData['city_id'];
  developer_id?: BuildingBasicInfoData['developer_id'];
  name?: BuildingBasicInfoData['name'];
  slug?: BuildingBasicInfoData['slug'];
  description?: BuildingBasicInfoData['description'];
  address?: BuildingBasicInfoData['address'];
  photos?: BuildingBasicInfoData['photos'];
}

function BuildingBasicInfo({ buildingId, area_id, city_id, developer_id, name, slug, description, address, photos }: BuildingBasicInfoProps) {
  const router = useRouter();
  const isEditMode = !!buildingId;
  const { data: cityOptions = [], isLoading: isLoadingCities } = useSWR<CityOption[]>('/api/admin/cities/options');
  const { data: areaOptions = [], isLoading: isLoadingAreas } = useSWR<AreaOption[]>('/api/admin/areas/options');
  const { data: developerOptions = [], isLoading: isLoadingDevelopers } = useSWR<DeveloperOption[]>('/api/admin/developers/options');
  const isLoadingOptions = isLoadingCities || isLoadingAreas || isLoadingDevelopers;

  const {
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<BuildingBasicInfoData>({
    resolver: zodResolver(buildingBasicInfoSchema),
    defaultValues: {
      area_id: area_id ?? '',
      city_id: city_id ?? '',
      developer_id: developer_id ?? '',
      name: name ?? '',
      slug: slug ?? '',
      description: description ?? '',
      address: address ?? '',
      photos: photos ?? [],
    },
  });

  const onSubmit = async (data: BuildingBasicInfoData) => {
    const payload = {
      ...data,
      developer_id: data.developer_id || null,
      description: data.description || null,
      address: data.address || null,
    };

    const result = isEditMode
      ? await updateBuilding(buildingId, payload)
      : await createBuilding({
          ...payload,
          location: null,
          building_type: null,
          ownership_type: null,
          completion_year: null,
          total_floors: null,
          total_units: null,
          property_types: [],
          avg_price_per_sqft: null,
          area_avg_price_per_sqft: null,
          rental_yield: null,
          service_charge_aed_per_sqft: null,
          short_term_rental_potential: null,
          demand_level: null,
          liquidity_score: null,
          capital_growth_score: null,
          lifestyle_score: null,
          overall_score: null,
          amenities: [],
          nearby_places: [],
          unit_price_ranges: [],
          rental_ranges: [],
          transaction_summary: {},
          pros: [],
          cons: [],
        } satisfies BuildingInsertData);

    if (!result?.success) {
      toast.error(result?.message || 'Failed to save building');
      return;
    }

    toast.success(isEditMode ? 'Building updated successfully' : 'Building created successfully');
    const savedBuilding = result.data as Building | undefined;

    if (!isEditMode && savedBuilding?.id) {
      router.replace(`/dashboard/admin/buildings/${savedBuilding.id}`);
      return;
    }

    router.refresh();
  };

  return (
    <WidgetCard icon={Building2} title="Basic Information" description="Connect the building to its area, city, developer, and public URL.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Controller
            name="city_id"
            control={control}
            render={({ field }) => <SelectGroup label="City" required error={errors.city_id?.message} field={field} options={cityOptions} placeholder="Select city" disabled={isLoadingOptions} />}
          />
          <Controller
            name="area_id"
            control={control}
            render={({ field }) => <SelectGroup label="Area" required error={errors.area_id?.message} field={field} options={areaOptions} placeholder="Select area" disabled={isLoadingOptions} />}
          />
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextInput
                id="name"
                label="Building Name"
                required
                icon={Building2}
                placeholder="e.g., Marina Gate"
                error={errors.name?.message}
                value={field.value}
                onChange={field.onChange}
                onBlur={(e) => {
                  field.onBlur();
                  if (!isEditMode) setValue('slug', generateSlug(e.target.value), { shouldDirty: true });
                }}
              />
            )}
          />
          <Controller name="slug" control={control} render={({ field }) => <TextInput id="slug" label="Slug" required placeholder="marina-gate" error={errors.slug?.message} {...field} />} />
          <Controller
            name="developer_id"
            control={control}
            render={({ field }) => (
              <SelectGroup label="Developer" error={errors.developer_id?.message} field={field} options={developerOptions} placeholder="Select developer" disabled={isLoadingOptions} />
            )}
          />
          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <TextInput id="address" label="Address" icon={MapPin} placeholder="Street or building address" error={errors.address?.message} value={field.value || ''} onChange={field.onChange} />
            )}
          />
        </div>

        <Controller
          name="photos"
          control={control}
          render={({ field }) => (
            <div className="grid gap-2">
              <Label>
                Building Photos <span className="text-destructive">*</span>
              </Label>
              <ImageUploader
                bucket="building-photos"
                folder={buildingId || 'temp'}
                value={field.value || []}
                onChange={(images) => {
                  field.onChange(images);
                  setValue('photos', images, { shouldDirty: true, shouldTouch: true });
                }}
                maxImages={10}
                label="Photos"
                required
              />
              {errors.photos && <p className="text-sm text-destructive">{errors.photos.message}</p>}
              <p className="text-xs text-muted-foreground">Upload building photos (JPG, PNG, WebP, max 5MB each, up to 10 photos)</p>
            </div>
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextArea id="description" label="Description" placeholder="Building overview..." error={errors.description?.message} rows={4} value={field.value || ''} onChange={field.onChange} />
          )}
        />
        <FormActions isSubmitting={isSubmitting} isEditMode={isEditMode} submitLabel="Building" />
      </form>
    </WidgetCard>
  );
}

export default BuildingBasicInfo;
