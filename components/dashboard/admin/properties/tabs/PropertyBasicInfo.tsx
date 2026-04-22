'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@/components/ui/label';
import { SelectField } from '@/components/shared/select-field';
import { TextInput } from '@/components/shared/forms/text-input';
import { TextArea } from '@/components/shared/forms/text-area';
import { PropertyFormData, propertyFormSchema } from '@/lib/validations/property';
import { createProperty, updateProperty, updatePropertyAmenities } from '@/lib/db/properties/actions';
import { useRouter } from 'next/navigation';
import { Property } from '@/types/property';
import { toast } from 'sonner';
import { ImageUploader } from '@/components/ui/image-uploader';
import { SelectOption } from '@/types/shared';
import { CategoryOption } from '@/types/category';
import { DeveloperOption } from '@/types';
import { getImageUrl, generateSlug } from '@/lib/utils';
import { FormActions } from '@/components/shared/forms/FormActions';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { MultiSelect } from '@/components/ui/multi-select';
import { fetcher } from '@/lib/swr-config';
import useSWR from 'swr';
import { useMemo } from 'react';
import { AmenityOption } from '@/types/amenities';
import { CityOption } from '@/types/city';
import { WidgetCard } from '@/components/shared/WidgetCard';

interface PropertyBasicInfoProps {
  property?: Property;
}

const statusOptions = [
  { value: 'available', label: 'Available' },
  { value: 'sold', label: 'Sold' },
  { value: 'reserved', label: 'Reserved' },
  { value: 'off_plan', label: 'Off Plan' },
];

export function PropertyBasicInfo({ property }: PropertyBasicInfoProps) {
  const router = useRouter();
  const isEditMode = !!property;

  // Fetch category options
  const { data: categories, isLoading: isLoadingCategories } = useSWR<CategoryOption[]>('/api/admin/categories/options', fetcher);

  // Fetch developer options
  const { data: developerList, isLoading: isLoadingDevelopers } = useSWR<DeveloperOption[]>('/api/admin/developers/options', fetcher);

  // Fetch amenity options
  const { data: amenityResponse, isLoading: isLoadingAmenities } = useSWR<{ success: boolean; data: AmenityOption[] }>('/api/admin/amenities/options', fetcher);
  const amenityOptions = amenityResponse?.data || [];

  // Fetch city options
  const { data: cityOptions, isLoading: isLoadingCities } = useSWR<CityOption[]>('/api/admin/cities/options', fetcher);
  const cityList = cityOptions || [];

  // Extract amenity IDs from property data
  const propertyAmenityIds = useMemo(() => {
    return property?.amenities?.map((a) => a.id) || [];
  }, [property?.amenities]);

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PropertyFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(propertyFormSchema) as any,
    defaultValues: property
      ? {
          title: property.title,
          slug: property.slug,
          description: property.description,
          category_id: property.category_id ?? '',
          developer_id: property.developer_id ?? '',
          city_id: property.city_id ?? undefined,
          bedrooms: property.bedrooms ?? 0,
          bathrooms: property.bathrooms ?? 1,
          size_sqft: property.size_sqft ?? 0,
          price_aed: property.price_aed ?? 0,
          status: property.status,
          golden_visa_eligible: property.golden_visa_eligible ?? false,
          is_featured: property.is_featured ?? false,
          photos: property.photos || [],
          features: property.features || [],
          floor_plan: property.floor_plan ?? undefined,
          location: property.location ?? undefined,
          amenity_ids: propertyAmenityIds,
          faqs: undefined,
        }
      : {
          title: '',
          slug: '',
          description: '',
          category_id: '',
          developer_id: undefined,
          city_id: undefined,
          bedrooms: 0,
          bathrooms: 0,
          size_sqft: 0,
          price_aed: 0,
          status: 'available',
          golden_visa_eligible: false,
          is_featured: false,
          photos: [],
          features: [],
          floor_plan: undefined,
          location: undefined,
          amenity_ids: [],
          faqs: undefined,
        },
  });

  const onSubmit = async (data: PropertyFormData) => {
    try {
      const { amenity_ids, ...propertyData } = data;
      const finalPropertyData = {
        ...propertyData,
        floor_plan: propertyData.floor_plan ?? null,
        developer_id: propertyData.developer_id ?? null,
        city_id: propertyData.city_id ?? null,
      };

      const result = isEditMode ? await updateProperty(property!.id, finalPropertyData) : await createProperty(finalPropertyData);

      if (!result?.success) {
        toast.error(result?.message || 'Failed to save property');
        return;
      }

      // Handle amenities separately after property is created/updated
      const propertyId = isEditMode ? property!.id : (result.data as Property)?.id;
      if (propertyId && amenity_ids) {
        const amenitiesResult = await updatePropertyAmenities(propertyId, amenity_ids);
        if (!amenitiesResult?.success) {
          toast.error('Property saved but failed to update amenities');
        }
      }

      toast.success(isEditMode ? 'Property updated successfully' : 'Property created successfully');

      if (!isEditMode && propertyId) {
        router.replace(`/dashboard/admin/properties/${propertyId}`);
      } else {
        router.push('/dashboard/admin/properties');
        router.refresh();
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('An unexpected error occurred');
    }
  };

  const categoryOptions = (categories || []).map((c) => ({
    value: c.value,
    label: c.label,
  }));

  const developerSelectOptions: SelectOption[] = (developerList || []).map((dev) => ({
    value: dev.value,
    label: dev.label,
    logo_url: getImageUrl(dev.logo_url),
  }));

  const citySelectOptions: SelectOption[] = (cityList || []).map((city) => ({
    value: city.value,
    label: city.label,
    logo_url: getImageUrl(city.logo_url),
  }));

  return (
    <WidgetCard>
      <form onSubmit={handleSubmit(onSubmit as any) /* eslint-disable-line */} className="space-y-6">
        {/* Title */}
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <TextInput
              id="title"
              label="Title"
              required
              placeholder="e.g., Luxury 2BR Apartment in Downtown Dubai"
              error={errors.title?.message}
              value={field.value}
              onChange={field.onChange}
              onBlur={(e) => {
                field.onBlur();
                setValue('slug', generateSlug(e.target.value));
              }}
            />
          )}
        />

        {/* Slug */}
        <Controller
          name="slug"
          control={control}
          render={({ field }) => <TextInput id="slug" label="Slug" placeholder="e.g., luxury-2br-apartment-downtown-dubai" error={errors.slug?.message} {...field} />}
        />

        {/* Description */}
        <Controller
          name="description"
          control={control}
          render={({ field }) => <TextArea id="description" label="Description" required placeholder="Describe the property..." error={errors.description?.message} {...field} />}
        />

        {/* Category */}
        <Controller
          name="category_id"
          control={control}
          render={({ field }) => (
            <div className="grid gap-2">
              <Label htmlFor="category_id">
                Category <span className="text-destructive">*</span>
              </Label>
              <SelectField
                options={categoryOptions}
                placeholder={isLoadingCategories ? 'Loading categories...' : 'Select a category'}
                value={field.value}
                onValueChange={(v) => field.onChange(v)}
                className="w-full"
                disabled={isLoadingCategories}
              />
              {errors.category_id && <p className="text-sm text-destructive">{errors.category_id.message}</p>}
            </div>
          )}
        />

        {/* Developer */}
        <Controller
          name="developer_id"
          control={control}
          render={({ field }) => (
            <div className="grid gap-2">
              <Label htmlFor="developer_id">Developer</Label>
              <SelectField
                options={developerSelectOptions}
                placeholder={isLoadingDevelopers ? 'Loading developers...' : 'Select a developer (optional)'}
                value={field.value ?? ''}
                onValueChange={(v) => field.onChange(v || null)}
                className="w-full"
                disabled={isLoadingDevelopers}
              />
              {errors.developer_id && <p className="text-sm text-destructive">{errors.developer_id.message}</p>}
            </div>
          )}
        />

        {/* City */}
        <Controller
          name="city_id"
          control={control}
          render={({ field }) => (
            <div className="grid gap-2">
              <Label htmlFor="city_id">City</Label>
              <SelectField
                options={citySelectOptions}
                placeholder={isLoadingCities ? 'Loading cities...' : 'Select a city (optional)'}
                value={field.value ?? ''}
                onValueChange={(v) => field.onChange(v || null)}
                className="w-full"
                disabled={isLoadingCities}
              />
              {errors.city_id && <p className="text-sm text-destructive">{errors.city_id.message}</p>}
            </div>
          )}
        />

        {/* Bedrooms & Bathrooms */}
        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="bedrooms"
            control={control}
            render={({ field }) => (
              <TextInput
                id="bedrooms"
                label="Bedrooms"
                type="number"
                min={0}
                placeholder="0"
                error={errors.bedrooms?.message}
                value={field.value}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
              />
            )}
          />
          <Controller
            name="bathrooms"
            control={control}
            render={({ field }) => (
              <TextInput
                id="bathrooms"
                label="Bathrooms"
                type="number"
                min={0}
                placeholder="0"
                error={errors.bathrooms?.message}
                value={field.value}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
              />
            )}
          />
        </div>

        {/* Size & Price */}
        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="size_sqft"
            control={control}
            render={({ field }) => (
              <TextInput
                id="size_sqft"
                label="Size (sqft)"
                required
                type="number"
                min={1}
                placeholder="1000"
                error={errors.size_sqft?.message}
                value={field.value}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
              />
            )}
          />
          <Controller
            name="price_aed"
            control={control}
            render={({ field }) => (
              <TextInput
                id="price_aed"
                label="Price (AED)"
                required
                type="number"
                min={0}
                placeholder="1000000"
                error={errors.price_aed?.message}
                value={field.value}
                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
              />
            )}
          />
        </div>

        {/* Status */}
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <SelectField options={statusOptions} placeholder="Select status" value={field.value} onValueChange={field.onChange} className="w-full" />
            </div>
          )}
        />

        {/* Golden Visa Eligible */}
        <div className="flex items-center gap-2">
          <Controller
            name="golden_visa_eligible"
            control={control}
            render={({ field }) => (
              <>
                <Input type="checkbox" id="golden_visa_eligible" className="h-4 w-4 cursor-pointer rounded border-gray-300" checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
                <Label htmlFor="golden_visa_eligible" className="cursor-pointer">
                  Golden Visa Eligible (AED 2M+)
                </Label>
              </>
            )}
          />
        </div>

        {/* Amenities */}
        <Controller
          name="amenity_ids"
          control={control}
          render={({ field }) => (
            <MultiSelect
              name="amenity_ids"
              label="Nearby Amenities"
              placeholder={isLoadingAmenities ? 'Loading amenities...' : 'Select amenities...'}
              options={amenityOptions}
              value={field.value || []}
              onChange={field.onChange}
              error={errors.amenity_ids?.message as string}
              disabled={isLoadingAmenities}
              isLoading={isLoadingAmenities}
            />
          )}
        />

        {/* Photos */}
        <Controller
          name="photos"
          control={control}
          render={({ field }) => (
            <div className="grid gap-2">
              <ImageUploader
                bucket="property-photos"
                value={field.value}
                onChange={(urls) => {
                  field.onChange(urls);
                  setValue('photos', urls, { shouldDirty: true, shouldTouch: true });
                }}
                maxImages={10}
                label="Photos"
                folder={property?.id || 'temp'}
              />
              {errors.photos && <p className="text-sm text-destructive">{errors.photos.message}</p>}
            </div>
          )}
        />

        {/* Floor Plan URL */}
        <Controller
          name="floor_plan"
          control={control}
          render={({ field }) => (
            <TextInput
              id="floor_plan"
              label="Floor Plan URL"
              type="url"
              placeholder="https://example.com/floor-plan.pdf"
              error={errors.floor_plan?.message}
              value={field.value ?? ''}
              onChange={(e) => field.onChange(e.target.value || undefined)}
            />
          )}
        />

        {/* Featured Property */}
        <div className="flex items-center justify-between gap-2">
          <Label htmlFor="is_featured" className="cursor-pointer">
            Featured Property
          </Label>
          <Controller name="is_featured" control={control} render={({ field }) => <Switch id="is_featured" checked={field.value} onCheckedChange={field.onChange} />} />
        </div>

        {/* Actions */}
        <FormActions isSubmitting={isSubmitting} isEditMode={isEditMode} submitLabel="Property" />
      </form>
    </WidgetCard>
  );
}

export default PropertyBasicInfo;
