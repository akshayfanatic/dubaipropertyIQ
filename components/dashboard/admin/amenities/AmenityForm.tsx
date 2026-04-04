'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { amenitySchema, AmenityFormData } from '@/lib/validations/amenity';
import { createAmenity, updateAmenity } from '@/lib/db/amenities/actions';
import { Amenity } from '@/types/amenities';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { generateSlug } from '@/lib/utils';
import { ImageUploader } from '@/components/ui/image-uploader';
import { FormActions } from '@/components/shared/forms/FormActions';

interface AmenityFormProps {
  amenity?: Amenity;
}

export function AmenityForm({ amenity }: AmenityFormProps) {
  const router = useRouter();
  const isEditMode = !!amenity;

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AmenityFormData>({
    resolver: zodResolver(amenitySchema),
    defaultValues: amenity
      ? {
          name: amenity.name,
          slug: amenity.slug,
          description: amenity.description || '',
          logo_url: amenity.logo_url || null,
        }
      : {
          name: '',
          slug: '',
          description: '',
          logo_url: null,
        },
  });

  const onSubmit = async (data: AmenityFormData) => {
    try {
      const result = isEditMode ? await updateAmenity(amenity!.id, data) : await createAmenity(data);

      if (!result?.success) {
        toast.error(result?.message || 'Failed to save amenity');
        return;
      }

      toast.success(isEditMode ? 'Amenity updated successfully' : 'Amenity created successfully');
      router.push('/dashboard/admin/amenities');
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
          placeholder="e.g., Metro Station"
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
        <Input id="slug" placeholder="e.g., metro-station" {...register('slug')} className={errors.slug ? 'border-destructive' : ''} />
        {errors.slug && <p className="text-sm text-destructive">{errors.slug.message}</p>}
        <p className="text-xs text-muted-foreground">URL-friendly identifier (lowercase letters, numbers, and hyphens only)</p>
      </div>

      {/* Logo */}
      <div className="space-y-2">
        <Label>Amenity Logo</Label>
        <Controller
          name="logo_url"
          control={control}
          render={({ field }) => (
            <ImageUploader
              bucket="amenity-logos"
              folder="logos"
              value={field.value ? [field.value] : []}
              onChange={(urls) => {
                const logoUrl = urls[0] || null;
                field.onChange(logoUrl);
                setValue('logo_url', logoUrl, { shouldDirty: true, shouldTouch: true });
              }}
              maxImages={1}
              label="Logo"
              accept="image/*,.svg"
            />
          )}
        />
        <p className="text-xs text-muted-foreground">Upload amenity logo (JPG, PNG, WebP or SVG, max 5MB)</p>
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
      <FormActions isSubmitting={isSubmitting} isEditMode={isEditMode} submitLabel="Amenity" />
    </form>
  );
}
