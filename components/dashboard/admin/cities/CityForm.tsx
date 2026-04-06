'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@/components/ui/label';
import { citySchema, CityFormData } from '@/lib/validations/city';
import { createCity, updateCity } from '@/lib/db/cities/actions';
import { City } from '@/types/city';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { generateSlug } from '@/lib/utils';
import { ImageUploader } from '@/components/ui/image-uploader';
import { FormActions } from '@/components/shared/forms/FormActions';
import { TextInput } from '@/components/shared/forms/text-input';
import { TextArea } from '@/components/shared/forms/text-area';

interface CityFormProps {
  city?: City;
}

export function CityForm({ city }: CityFormProps) {
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
          logo_url: city.logo_url || null,
        }
      : {
          name: '',
          slug: '',
          description: '',
          logo_url: null,
        },
  });

  const onSubmit = async (data: CityFormData) => {
    try {
      // Ensure logo_url is null instead of undefined for database compatibility
      const submitData = {
        ...data,
        logo_url: data.logo_url ?? null,
      };
      const result = isEditMode ? await updateCity(city!.id, submitData) : await createCity(submitData);

      if (!result?.success) {
        toast.error(result?.message || 'Failed to save city');
        return;
      }

      toast.success(isEditMode ? 'City updated successfully' : 'City created successfully');
      router.push('/dashboard/admin/cities');
      router.refresh();
    } catch {
      toast.error('An unexpected error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name */}
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

      {/* Slug */}
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

      {/* Image */}
      <Controller
        name="logo_url"
        control={control}
        render={({ field }) => (
          <div className="grid gap-2">
            <Label>City Image</Label>
            <ImageUploader
              bucket="city-logos"
              folder="cities"
              value={field.value ? [field.value] : []}
              onChange={(urls) => {
                const logoUrl = urls[0] || null;
                field.onChange(logoUrl);
                setValue('logo_url', logoUrl, { shouldDirty: true, shouldTouch: true });
              }}
              maxImages={1}
              label="City Image"
              accept="image/*,.svg"
            />
            <p className="text-xs text-muted-foreground">Upload city image (JPG, PNG, WebP or SVG, max 5MB)</p>
          </div>
        )}
      />

      {/* Description */}
      <Controller
        name="description"
        control={control}
        render={({ field }) => <TextArea id="description" label="Description" placeholder="The largest and most populous city in the UAE..." error={errors.description?.message} rows={4} {...field} />}
      />

      {/* Actions */}
      <FormActions isSubmitting={isSubmitting} isEditMode={isEditMode} submitLabel="City" />
    </form>
  );
}
