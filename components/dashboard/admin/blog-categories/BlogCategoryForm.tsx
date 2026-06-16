'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { generateSlug } from '@/lib/utils';
import { blogCategorySchema, type BlogCategoryFormData } from '@/lib/validations/blog-category';
import { createBlogCategory, updateBlogCategory } from '@/lib/db/blog-categories/actions';
import type { BlogCategory } from '@/types/blog-category';
import { FormActions } from '@/components/shared/forms/FormActions';
import { TextInput } from '@/components/shared/forms/text-input';
import { TextArea } from '@/components/shared/forms/text-area';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface BlogCategoryFormProps {
  id?: string;
  category?: BlogCategory;
}

export function BlogCategoryForm({ id = '', category }: BlogCategoryFormProps) {
  const router = useRouter();
  const isEditMode = !!id;

  const {
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<BlogCategoryFormData>({
    resolver: zodResolver(blogCategorySchema),
    defaultValues: category
      ? {
          name: category.name,
          slug: category.slug,
          description: category.description || '',
          is_active: category.is_active,
        }
      : {
          name: '',
          slug: '',
          description: '',
          is_active: true,
        },
  });

  const onSubmit = async (data: BlogCategoryFormData) => {
    try {
      const result = isEditMode ? await updateBlogCategory(id, data) : await createBlogCategory(data);

      if (!result?.success) {
        toast.error(result?.message || 'Failed to save blog category');
        return;
      }

      toast.success(isEditMode ? 'Blog category updated successfully' : 'Blog category created successfully');

      if (!isEditMode && result.data) {
        const categoryId = (result.data as BlogCategory)?.id;
        if (categoryId) {
          router.replace(`/dashboard/admin/blog-categories/${categoryId}`);
        }
      }
    } catch {
      toast.error('An unexpected error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <TextInput
            id="name"
            label="Name"
            required
            placeholder="e.g., Market Guides"
            error={errors.name?.message}
            value={field.value}
            onChange={(event) => {
              field.onChange(event);
              setValue('slug', generateSlug(event.target.value), { shouldDirty: true, shouldValidate: true });
            }}
          />
        )}
      />

      <Controller
        name="slug"
        control={control}
        render={({ field }) => (
          <div className="grid gap-2">
            <TextInput id="slug" label="Slug" required placeholder="e.g., market-guides" error={errors.slug?.message} {...field} />
            <p className="text-xs text-muted-foreground">URL-friendly identifier for filtering and category pages.</p>
          </div>
        )}
      />

      <Controller
        name="description"
        control={control}
        render={({ field }) => <TextArea id="description" label="Description" placeholder="Optional category description..." error={errors.description?.message} rows={3} {...field} />}
      />

      <Controller
        name="is_active"
        control={control}
        render={({ field }) => (
          <div className="flex items-center gap-2">
            <Switch id="is_active" checked={field.value} onCheckedChange={field.onChange} />
            <Label htmlFor="is_active">Active</Label>
          </div>
        )}
      />

      <FormActions isSubmitting={isSubmitting} isEditMode={isEditMode} submitLabel="Blog Category" />
    </form>
  );
}
