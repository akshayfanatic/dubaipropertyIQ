'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@/components/ui/label';
import { SelectField } from '@/components/shared/select-field';
import { TextInput } from '@/components/shared/forms/text-input';
import { TextArea } from '@/components/shared/forms/text-area';
import { PropertyFormData, propertyFormSchema } from '@/lib/validations/property';
import { createProperty } from '@/lib/db/properties/actions';
import { updateProperty } from '@/lib/db/properties/actions';
import { useRouter } from 'next/navigation';
import { Property } from '@/types/property';
import { toast } from 'sonner';
import { ImageUploader } from '@/components/ui/image-uploader';
import { SelectOption } from '@/components/shared/select-field';
import { Category } from '@/types/category';
import { DeveloperOption } from '@/types';
import { getImageUrl } from '@/lib/utils';
import { FormActions } from '@/components/shared/forms/FormActions';
import { Input } from '@/components/ui/input';

interface PropertyFormProps {
  property?: Property;
  categories: Category[];
  developerList: DeveloperOption[];
}

const statusOptions = [
  { value: 'available', label: 'Available' },
  { value: 'sold', label: 'Sold' },
  { value: 'reserved', label: 'Reserved' },
  { value: 'off_plan', label: 'Off Plan' },
];

export function PropertyForm({ property, categories, developerList }: PropertyFormProps) {
  const router = useRouter();
  const isEditMode = !!property;

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: property
      ? {
          title: property.title,
          description: property.description,
          category_id: property.category_id,
          developer_id: property.developer_id ?? undefined,
          bedrooms: property.bedrooms ?? 0,
          bathrooms: property.bathrooms ?? 1,
          size_sqft: property.size_sqft ?? 0,
          price_aed: property.price_aed ?? 0,
          status: property.status,
          golden_visa_eligible: property.golden_visa_eligible,
          photos: property.photos || [],
          features: property.features || [],
          floor_plan: property.floor_plan ?? undefined,
        }
      : {
          title: '',
          description: '',
          category_id: '',
          developer_id: undefined,
          bedrooms: 0,
          bathrooms: 0,
          size_sqft: 0,
          price_aed: 0,
          status: 'available',
          golden_visa_eligible: false,
          photos: [],
          features: [],
          floor_plan: undefined,
        },
  });

  const onSubmit = async (data: PropertyFormData) => {
    try {
      const propertyData = {
        ...data,
        floor_plan: data.floor_plan ?? null,
        developer_id: data.developer_id ?? null,
      };

      const result = isEditMode ? await updateProperty(property!.id, propertyData) : await createProperty(propertyData);

      if (!result?.success) {
        toast.error(result?.message || 'Failed to save property');
        return;
      }

      toast.success(isEditMode ? 'Property updated successfully' : 'Property created successfully');
      router.push('/dashboard/admin/properties');
      router.refresh();
    } catch {
      toast.error('An unexpected error occurred');
    }
  };

  const categoryOptions = categories.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  const developerSelectOptions: SelectOption[] = developerList.map((dev) => ({
    value: dev.value,
    label: dev.label,
    logo_url: getImageUrl(dev.logo_url),
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Title */}
      <Controller
        name="title"
        control={control}
        render={({ field }) => <TextInput id="title" label="Title" required placeholder="e.g., Luxury 2BR Apartment in Downtown Dubai" error={errors.title?.message} {...field} />}
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
            <SelectField options={categoryOptions} placeholder="Select a category" value={field.value} onValueChange={field.onChange} className="w-full" />
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
            <SelectField options={developerSelectOptions} placeholder="Select a developer (optional)" value={field.value ?? ''} onValueChange={(v) => field.onChange(v || null)} className="w-full" />
            {errors.developer_id && <p className="text-sm text-destructive">{errors.developer_id.message}</p>}
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

      {/* Actions */}
      <FormActions isSubmitting={isSubmitting} isEditMode={isEditMode} submitLabel="Property" />
    </form>
  );
}
