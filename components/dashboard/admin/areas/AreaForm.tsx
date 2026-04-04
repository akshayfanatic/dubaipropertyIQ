'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { areaSchema, AreaFormData } from '@/lib/validations/area';
import { createArea, updateArea } from '@/lib/db/areas/actions';
import { Area } from '@/types/areas';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { generateSlug } from '@/lib/utils';
import { ImageUploader } from '@/components/ui/image-uploader';
import { SelectField } from '@/components/shared/select-field';
import useSWR from 'swr';
import { fetcher } from '@/lib/utils';
import { CityOption } from '@/types/city';
import { FormActions } from '@/components/shared/forms/FormActions';

interface AreaFormProps {
  area?: Area & { cities?: { name: string } | null };
}

export function AreaForm({ area }: AreaFormProps) {
  const router = useRouter();
  const isEditMode = !!area;

  const { data: cityOptions = [], isLoading: isLoadingCities } = useSWR<CityOption[]>('/api/admin/cities/options', fetcher);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AreaFormData>({
    resolver: zodResolver(areaSchema),
    defaultValues: {
      city_id: area?.city_id || '',
      name: area?.name || '',
      slug: area?.slug || '',
      description: area?.description || '',
      photos: area?.photos || [],
    },
  });

  const onSubmit = async (data: AreaFormData) => {
    try {
      const result = isEditMode ? await updateArea(area!.id, data) : await createArea(data);

      if (!result?.success) {
        toast.error(result?.message || 'Failed to save area');
        return;
      }

      toast.success(isEditMode ? 'Area updated successfully' : 'Area created successfully');
      router.push('/dashboard/admin/areas');
      router.refresh();
    } catch {
      toast.error('An unexpected error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* City */}
      <div className="space-y-2">
        <Label htmlFor="city_id">City *</Label>
        <Controller
          name="city_id"
          control={control}
          render={({ field }) => (
            <SelectField
              options={cityOptions}
              placeholder={isLoadingCities ? 'Loading cities...' : 'Select a city'}
              value={field.value}
              onValueChange={field.onChange}
              disabled={isLoadingCities}
              className={errors.city_id ? 'border-destructive' : ''}
            />
          )}
        />
        {errors.city_id && <p className="text-sm text-destructive">{errors.city_id.message}</p>}
      </div>

      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          placeholder="e.g., Downtown Dubai"
          {...register('name', {
            onBlur: (e) => {
              setValue('slug', generateSlug(e.target.value));
            },
          })}
          className={errors.name ? 'border-destructive' : ''}
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      {/* Slug */}
      <div className="space-y-2">
        <Label htmlFor="slug">Slug *</Label>
        <Input id="slug" placeholder="e.g., downtown-dubai" {...register('slug')} className={errors.slug ? 'border-destructive' : ''} />
        {errors.slug && <p className="text-sm text-destructive">{errors.slug.message}</p>}
        <p className="text-xs text-muted-foreground">URL-friendly identifier (lowercase letters, numbers, and hyphens only)</p>
      </div>

      {/* Photos */}
      <div className="space-y-2">
        <Label>Area Photos</Label>
        <Controller
          name="photos"
          control={control}
          render={({ field }) => (
            <ImageUploader
              bucket="area-photos"
              folder="areas"
              value={field.value?.map((url) => ({ url, alt_tag: '' })) || []}
              onChange={(urls) => {
                const photoUrls = urls.map((u) => u.url);
                field.onChange(photoUrls);
                setValue('photos', photoUrls, { shouldDirty: true, shouldTouch: true });
              }}
              maxImages={10}
              label="Photos"
              accept="image/*"
            />
          )}
        />
        <p className="text-xs text-muted-foreground">Upload area photos (JPG, PNG, WebP, max 5MB each, up to 10 photos)</p>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          placeholder="Optional description..."
          rows={3}
          {...register('description')}
          className={`w-full rounded-md border bg-transparent px-3 py-2 text-sm ${errors.description ? 'border-destructive' : 'border-input'}`}
        />
        {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
      </div>

      {/* Actions */}
      <FormActions isSubmitting={isSubmitting} isEditMode={isEditMode} submitLabel="Area" />
    </form>
  );
}
