'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { TextInput } from '@/components/shared/forms/text-input';
import { TextArea } from '@/components/shared/forms/text-area';

interface AreaFormProps {
  area?: Area & { cities?: { name: string } | null };
}

export function AreaForm({ area }: AreaFormProps) {
  const router = useRouter();
  const isEditMode = !!area;

  const { data: cityOptions = [], isLoading: isLoadingCities } = useSWR<CityOption[]>('/api/admin/cities/options', fetcher);

  const {
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
      <Controller
        name="city_id"
        control={control}
        render={({ field }) => (
          <div className="grid gap-2">
            <Label htmlFor="city_id">
              City <span className="text-destructive">*</span>
            </Label>
            <SelectField options={cityOptions} placeholder={isLoadingCities ? 'Loading cities...' : 'Select a city'} value={field.value} onValueChange={field.onChange} disabled={isLoadingCities} />
            {errors.city_id && <p className="text-sm text-destructive">{errors.city_id.message}</p>}
          </div>
        )}
      />

      {/* Name */}
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <TextInput
            id="name"
            label="Name"
            required
            placeholder="e.g., Downtown Dubai"
            error={errors.name?.message}
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
        render={({ field }) => (
          <div className="grid gap-2">
            <TextInput id="slug" label="Slug" required placeholder="e.g., downtown-dubai" error={errors.slug?.message} {...field} />
            <p className="text-xs text-muted-foreground">URL-friendly identifier (lowercase letters, numbers, and hyphens only)</p>
          </div>
        )}
      />

      {/* Photos */}
      <Controller
        name="photos"
        control={control}
        render={({ field }) => (
          <div className="grid gap-2">
            <Label>Area Photos</Label>
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
            <p className="text-xs text-muted-foreground">Upload area photos (JPG, PNG, WebP, max 5MB each, up to 10 photos)</p>
          </div>
        )}
      />

      {/* Description */}
      <Controller
        name="description"
        control={control}
        render={({ field }) => <TextArea id="description" label="Description" placeholder="Optional description..." error={errors.description?.message} rows={3} {...field} />}
      />

      {/* Actions */}
      <FormActions isSubmitting={isSubmitting} isEditMode={isEditMode} submitLabel="Area" />
    </form>
  );
}
