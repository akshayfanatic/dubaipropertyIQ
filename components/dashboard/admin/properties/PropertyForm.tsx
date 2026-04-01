'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SelectField } from '@/components/ui/select-field';
import { PropertyFormData, propertyFormSchema } from '@/lib/validations/property';

import { createProperty } from '@/lib/db/properties/actions';
import { updateProperty } from '@/lib/db/properties/actions';
import { useRouter } from 'next/navigation';
import { Property } from '@/types/property';
import { toast } from 'sonner';
import { ImageUploader } from '@/components/ui/image-uploader';
import { Category } from '@/types/category';
import { DeveloperOption } from '@/types';

interface PropertyFormProps {
  property?: Property; // For edit mode
  categories: Category[];
  developerList: DeveloperOption[];
  onSuccess?: () => void;
  onCancel?: () => void;
}

const statusOptions = [
  { value: 'available', label: 'Available' },
  { value: 'sold', label: 'Sold' },
  { value: 'reserved', label: 'Reserved' },
  { value: 'off_plan', label: 'Off Plan' },
];

export function PropertyForm({ property, categories, developerList, onSuccess, onCancel }: PropertyFormProps) {
  const router = useRouter();
  const isEditMode = !!property;

  const {
    register,
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
      // Convert undefined floor_plan and developer_id to null for consistency with database
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
      onSuccess?.();
      router.push('/dashboard/admin/properties');
      router.refresh();
    } catch (error) {
      toast.error('An unexpected error occurred');
    }
  };

  const categoryOptions = categories.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input id="title" placeholder="e.g., Luxury 2BR Apartment in Downtown Dubai" {...register('title')} className={errors.title ? 'border-destructive' : ''} />
        {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <textarea
          id="description"
          placeholder="Describe the property..."
          rows={4}
          {...register('description')}
          className={`w-full rounded-md border bg-transparent px-3 py-2 text-sm ${errors.description ? 'border-destructive' : 'border-input'}`}
        />
        {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label htmlFor="category_id">Category *</Label>
        <Controller
          name="category_id"
          control={control}
          render={({ field }) => <SelectField options={categoryOptions} placeholder="Select a category" value={field.value} onValueChange={field.onChange} className="w-full" />}
        />
        {errors.category_id && <p className="text-sm text-destructive">{errors.category_id.message}</p>}
      </div>

      {/* Developer */}
      <div className="space-y-2">
        <Label htmlFor="developer_id">Developer</Label>
        <Controller
          name="developer_id"
          control={control}
          render={({ field }) => (
            <SelectField options={developerList} placeholder="Select a developer (optional)" value={field.value ?? ''} onValueChange={(v) => field.onChange(v || null)} className="w-full" />
          )}
        />
        {errors.developer_id && <p className="text-sm text-destructive">{errors.developer_id.message}</p>}
      </div>

      {/* Bedrooms & Bathrooms */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="bedrooms">Bedrooms</Label>
          <Controller
            name="bedrooms"
            control={control}
            render={({ field }) => (
              <Input id="bedrooms" type="number" min={0} value={field.value} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} className={errors.bedrooms ? 'border-destructive' : ''} />
            )}
          />
          {errors.bedrooms && <p className="text-sm text-destructive">{errors.bedrooms.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="bathrooms">Bathrooms</Label>
          <Controller
            name="bathrooms"
            control={control}
            render={({ field }) => (
              <Input
                id="bathrooms"
                type="number"
                min={0}
                value={field.value}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                className={errors.bathrooms ? 'border-destructive' : ''}
              />
            )}
          />
          {errors.bathrooms && <p className="text-sm text-destructive">{errors.bathrooms.message}</p>}
        </div>
      </div>

      {/* Size & Price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="size_sqft">Size (sqft) *</Label>
          <Controller
            name="size_sqft"
            control={control}
            render={({ field }) => (
              <Input
                id="size_sqft"
                type="number"
                min={1}
                value={field.value}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                className={errors.size_sqft ? 'border-destructive' : ''}
              />
            )}
          />
          {errors.size_sqft && <p className="text-sm text-destructive">{errors.size_sqft.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="price_aed">Price (AED) *</Label>
          <Controller
            name="price_aed"
            control={control}
            render={({ field }) => (
              <Input
                id="price_aed"
                type="number"
                min={0}
                value={field.value}
                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                className={errors.price_aed ? 'border-destructive' : ''}
              />
            )}
          />
          {errors.price_aed && <p className="text-sm text-destructive">{errors.price_aed.message}</p>}
        </div>
      </div>

      {/* Status */}
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Controller
          name="status"
          control={control}
          render={({ field }) => <SelectField options={statusOptions} placeholder="Select status" value={field.value} onValueChange={field.onChange} className="w-full" />}
        />
      </div>

      {/* Golden Visa Eligible */}
      <div className="flex items-center gap-2">
        <Controller
          name="golden_visa_eligible"
          control={control}
          render={({ field }) => (
            <>
              <input type="checkbox" id="golden_visa_eligible" className="h-4 w-4 cursor-pointer rounded border-gray-300" checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
              <Label htmlFor="golden_visa_eligible" className="cursor-pointer">
                Golden Visa Eligible (AED 2M+)
              </Label>
            </>
          )}
        />
      </div>

      {/* Photos */}
      <div className="space-y-2">
        <Controller
          name="photos"
          control={control}
          render={({ field }) => (
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
          )}
        />
        {errors.photos && <p className="text-sm text-destructive">{errors.photos.message}</p>}
      </div>

      {/* Floor Plan URL */}
      <div className="space-y-2">
        <Label htmlFor="floor_plan">Floor Plan URL</Label>
        <Controller
          name="floor_plan"
          control={control}
          render={({ field }) => (
            <Input
              id="floor_plan"
              type="url"
              placeholder="https://example.com/floor-plan.pdf"
              value={field.value ?? ''}
              onChange={(e) => field.onChange(e.target.value || undefined)}
              className={errors.floor_plan ? 'border-destructive' : ''}
            />
          )}
        />
        {errors.floor_plan && <p className="text-sm text-destructive">{errors.floor_plan.message}</p>}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-6">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="cursor-pointer">
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting} className="cursor-pointer min-w-30">
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {isEditMode ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {isEditMode ? 'Update Property' : 'Create Property'}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
