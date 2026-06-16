'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { generateSlug } from '@/lib/utils';
import { blogTagSchema, type BlogTagFormData } from '@/lib/validations/blog-tag';
import { createBlogTag, updateBlogTag } from '@/lib/db/blog-tags/actions';
import type { BlogTag } from '@/types/blog-tag';
import { FormActions } from '@/components/shared/forms/FormActions';
import { TextInput } from '@/components/shared/forms/text-input';
import { TextArea } from '@/components/shared/forms/text-area';

interface BlogTagFormProps {
  id?: string;
  tag?: BlogTag;
}

export function BlogTagForm({ id = '', tag }: BlogTagFormProps) {
  const router = useRouter();
  const isEditMode = !!id;

  const {
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<BlogTagFormData>({
    resolver: zodResolver(blogTagSchema),
    defaultValues: tag
      ? {
          name: tag.name,
          slug: tag.slug,
          description: tag.description || '',
        }
      : {
          name: '',
          slug: '',
          description: '',
        },
  });

  const onSubmit = async (data: BlogTagFormData) => {
    try {
      const result = isEditMode ? await updateBlogTag(id, data) : await createBlogTag(data);

      if (!result?.success) {
        toast.error(result?.message || 'Failed to save blog tag');
        return;
      }

      toast.success(isEditMode ? 'Blog tag updated successfully' : 'Blog tag created successfully');

      if (!isEditMode && result.data) {
        const tagId = (result.data as BlogTag)?.id;
        if (tagId) {
          router.replace(`/dashboard/admin/blog-tags/${tagId}`);
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
            placeholder="e.g., ROI"
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
            <TextInput id="slug" label="Slug" required placeholder="e.g., roi" error={errors.slug?.message} {...field} />
            <p className="text-xs text-muted-foreground">URL-friendly identifier for this tag.</p>
          </div>
        )}
      />

      <Controller
        name="description"
        control={control}
        render={({ field }) => <TextArea id="description" label="Description" placeholder="Optional tag description..." error={errors.description?.message} rows={3} {...field} />}
      />

      <FormActions isSubmitting={isSubmitting} isEditMode={isEditMode} submitLabel="Blog Tag" />
    </form>
  );
}
