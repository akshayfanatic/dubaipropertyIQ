'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { citySchema, CityFormData } from '@/lib/validations/city';
import { createCity, updateCity } from '@/lib/db/cities/actions';
import { City } from '@/types/city';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { generateSlug } from '@/lib/utils';
import { ImageUploader } from '@/components/ui/image-uploader';
import { FormActions } from '@/components/shared/forms/FormActions';

interface CityFormProps {
  city?: City;
}

export function CityForm({ city }: CityFormProps) {
  const router = useRouter();
  const isEditMode = !!city;

  const {
    register,
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
      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          placeholder="e.g., Dubai"
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
        <Input id="slug" placeholder="e.g., dubai" {...register('slug')} className={errors.slug ? 'border-destructive' : ''} />
        {errors.slug && <p className="text-sm text-destructive">{errors.slug.message}</p>}
        <p className="text-xs text-muted-foreground">URL-friendly identifier (lowercase letters, numbers, and hyphens only)</p>
      </div>

      {/* Image */}
      <div className="space-y-2">
        <Label>City Image</Label>
        <Controller
          name="logo_url"
          control={control}
          render={({ field }) => (
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
          )}
        />
        <p className="text-xs text-muted-foreground">Upload city image (JPG, PNG, WebP or SVG, max 5MB)</p>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          placeholder="The largest and most populous city in the UAE..."
          rows={4}
          {...register('description')}
          className={`w-full rounded-md border bg-transparent px-3 py-2 text-sm ${errors.description ? 'border-destructive' : 'border-input'}`}
        />
        {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
      </div>

      {/* Actions */}
      <FormActions isSubmitting={isSubmitting} isEditMode={isEditMode} submitLabel="City" />
    </form>
  );
}
