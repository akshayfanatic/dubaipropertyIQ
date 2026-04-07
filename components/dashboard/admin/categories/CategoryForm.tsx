'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@/components/ui/label';
import { categorySchema, CategoryFormData } from '@/lib/validations/category';
import { createCategory, updateCategory } from '@/lib/db/categories/actions';
import { Category } from '@/types/category';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { generateSlug } from '@/lib/utils';
import { ImageUploader } from '@/components/ui/image-uploader';
import { FormActions } from '@/components/shared/forms/FormActions';
import { TextInput } from '@/components/shared/forms/text-input';
import { TextArea } from '@/components/shared/forms/text-area';

interface CategoryFormProps {
  category?: Category;
}

export function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter();
  const isEditMode = !!category;

  const {
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: category
      ? {
          name: category.name,
          slug: category.slug,
          description: category.description || '',
          logo_url: category.logo_url || null,
        }
      : {
          name: '',
          slug: '',
          description: '',
          logo_url: null,
        },
  });

  const onSubmit = async (data: CategoryFormData) => {
    try {
      const result = isEditMode ? await updateCategory(category!.id, data) : await createCategory(data);

      if (!result?.success) {
        toast.error(result?.message || 'Failed to save category');
        return;
      }

      toast.success(isEditMode ? 'Category updated successfully' : 'Category created successfully');

      const categoryId = isEditMode ? category!.id : (result.data as Category)?.id;
      if (!isEditMode && categoryId) {
        router.replace(`/dashboard/admin/categories/${categoryId}`);
      } else {
        router.push('/dashboard/admin/categories');
        router.refresh();
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
            placeholder="e.g., Apartment"
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
            <TextInput id="slug" label="Slug" required placeholder="e.g., apartment" error={errors.slug?.message} {...field} />
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
            <Label>Category Logo</Label>
            <ImageUploader
              bucket="category-logos"
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
            <p className="text-xs text-muted-foreground">Upload category logo (JPG, PNG, WebP or SVG, max 5MB)</p>
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
      <FormActions isSubmitting={isSubmitting} isEditMode={isEditMode} submitLabel="Category" />
    </form>
  );
}
