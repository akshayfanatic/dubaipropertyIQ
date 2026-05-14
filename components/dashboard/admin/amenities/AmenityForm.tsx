'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@/components/ui/label';
import { amenitySchema, AmenityFormData } from '@/lib/validations/amenity';
import { createAmenity, updateAmenity } from '@/lib/db/amenities/actions';
import { Amenity } from '@/types/amenities';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { generateSlug } from '@/lib/utils';
import { ImageUploader } from '@/components/ui/image-uploader';
import { FormActions } from '@/components/shared/forms/FormActions';
import { TextInput } from '@/components/shared/forms/text-input';
import { TextArea } from '@/components/shared/forms/text-area';

interface AmenityFormProps {
  amenity?: Amenity;
}

export function AmenityForm({ amenity }: AmenityFormProps) {
  const router = useRouter();
  const isEditMode = !!amenity;

  const {
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          logo_url: (amenity.logo_url as any) || null,
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

      const amenityId = isEditMode ? amenity!.id : (result.data as Amenity)?.id;

      if (!isEditMode && amenityId) {
        router.replace(`/dashboard/admin/amenities/${amenityId}`);
      }
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
            placeholder="e.g., Metro Station"
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
            <TextInput id="slug" label="Slug" required placeholder="e.g., metro-station" error={errors.slug?.message} {...field} />
            <p className="text-xs text-muted-foreground">URL-friendly identifier (lowercase letters, numbers, and hyphens only)</p>
          </div>
        )}
      />

      {/* Logo */}
      <Controller
        name="logo_url"
        control={control}
        render={({ field }) => (
          <div className="grid gap-2">
            <Label>Amenity Logo</Label>
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
            />
            <p className="text-xs text-muted-foreground">Upload amenity logo (JPG, PNG, WebP or SVG, max 5MB)</p>
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
      <FormActions isSubmitting={isSubmitting} isEditMode={isEditMode} submitLabel="Amenity" />
    </form>
  );
}
