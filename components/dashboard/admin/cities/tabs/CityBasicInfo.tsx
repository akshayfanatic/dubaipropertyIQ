'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { citySchema, type CityFormData } from '@/lib/validations/city';
import { createCity, updateCity } from '@/lib/db/cities/actions';
import { generateSlug } from '@/lib/utils';
import { ImageUploader } from '@/components/ui/image-uploader';
import { FormActions } from '@/components/shared/forms/FormActions';
import { TextInput } from '@/components/shared/forms/text-input';
import { TextArea } from '@/components/shared/forms/text-area';
import { WidgetCard } from '@/components/shared/WidgetCard';
import type { City } from '@/types/city';
import type { ImageObject } from '@/types/images';

interface CityBasicInfoProps {
  city?: City;
}

function toImageObject(value: unknown): ImageObject {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return { url: '', alt_tag: '' };
  }

  const image = value as Record<string, unknown>;
  return {
    url: typeof image.url === 'string' ? image.url : '',
    alt_tag: typeof image.alt_tag === 'string' ? image.alt_tag : '',
  };
}

export function CityBasicInfo({ city }: CityBasicInfoProps) {
  const router = useRouter();
  const isEditMode = !!city;

  const {
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CityFormData>({
    resolver: zodResolver(citySchema),
    defaultValues: city
      ? {
          name: city.name,
          slug: city.slug,
          description: city.description || '',
          logo_url: toImageObject(city.logo_url),
        }
      : {
          name: '',
          slug: '',
          description: '',
          logo_url: { url: '', alt_tag: '' },
        },
  });

  const onSubmit = async (data: CityFormData) => {
    try {
      const submitData = {
        ...data,
        description: data.description ?? null,
      };
      const result = isEditMode ? await updateCity(city.id, submitData) : await createCity(submitData);

      if (!result?.success) {
        toast.error(result?.message || 'Failed to save city');
        return;
      }

      toast.success(isEditMode ? 'City updated successfully' : 'City created successfully');

      const cityId = isEditMode ? city.id : (result.data as City)?.id;
      if (!isEditMode && cityId) {
        router.replace(`/dashboard/admin/cities/${cityId}`);
      } else {
        router.push('/dashboard/admin/cities');
        router.refresh();
      }
    } catch {
      toast.error('An unexpected error occurred');
    }
  };

  return (
    <WidgetCard title="Basic Information" description="Add Basic Information of City">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextInput
              id="name"
              label="Name"
              required
              placeholder="e.g., Dubai"
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

        <Controller
          name="slug"
          control={control}
          render={({ field }) => (
            <div className="grid gap-2">
              <TextInput id="slug" label="Slug" required placeholder="e.g., dubai" error={errors.slug?.message} {...field} />
              <p className="text-xs text-muted-foreground">URL-friendly identifier (lowercase letters, numbers, and hyphens only)</p>
            </div>
          )}
        />

        <Controller
          name="logo_url"
          control={control}
          render={({ field }) => (
            <div className="grid gap-2">
              <Label>
                City Image
                <span className="text-destructive ml-1">*</span>
              </Label>
              <ImageUploader
                bucket="city-logos"
                folder="cities"
                value={field.value?.url ? [field.value] : []}
                onChange={(urls) => {
                  const logoUrl = urls[0] || { url: '', alt_tag: '' };
                  field.onChange(logoUrl);
                  setValue('logo_url', logoUrl, { shouldDirty: true, shouldTouch: true });
                }}
                maxImages={1}
                label="City Image"
                required
              />
              {errors.logo_url && <p className="text-base text-destructive">{errors.logo_url.message || 'City image is required'}</p>}
              <p className="text-xs text-muted-foreground">Upload city image (JPG, PNG, WebP or SVG, max 5MB)</p>
            </div>
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextArea id="description" label="Description" placeholder="The largest and most populous city in the UAE..." error={errors.description?.message} rows={4} {...field} />
          )}
        />

        <FormActions isSubmitting={isSubmitting} isEditMode={isEditMode} submitLabel="City" />
      </form>
    </WidgetCard>
  );
}

export default CityBasicInfo;
