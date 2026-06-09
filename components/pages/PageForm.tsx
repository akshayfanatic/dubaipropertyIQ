'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { pageSchema, PageFormData } from '@/lib/validations/page';
import { createPage, updatePage } from '@/lib/db/pages/actions';
import { Page } from '@/types/page';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { generateSlug } from '@/lib/utils';
import { FormActions } from '@/components/shared/forms/FormActions';
import { TextInput } from '@/components/shared/forms/text-input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { TiptapEditor } from '@/components/shared/editor/TiptapEditor';
import { TextArea } from '@/components/shared/forms/text-area';
import { useEffect } from 'react';

interface PageFormProps {
  id?: string;
  page?: Page;
}

export function PageForm({ id = '', page }: PageFormProps) {
  const router = useRouter();
  const isEditMode = !!id;

  const {
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PageFormData>({
    resolver: zodResolver(pageSchema),
    defaultValues: {
      title: '',
      slug: '',
      content: { type: 'doc', content: [] },
      excerpt: '',
      meta_title: '',
      meta_description: '',
      is_published: false,
    },
  });

  useEffect(() => {
    if (page) {
      reset({
        title: page.title,
        slug: page.slug,
        content: page.content as PageFormData['content'],
        excerpt: page.excerpt || '',
        meta_title: page.pages_seo?.meta_title || '',
        meta_description: page.pages_seo?.meta_description || '',
        is_published: page.is_published ?? false,
      });
    }
  }, [page, reset]);

  const onSubmit = async (data: PageFormData) => {
    try {
      const result = isEditMode ? await updatePage(id, data) : await createPage(data);

      if (!result?.success) {
        toast.error(result?.message || 'Failed to save page');
        return;
      }

      toast.success(isEditMode ? 'Page updated successfully' : 'Page created successfully');

      if (!isEditMode && result.data) {
        const pageId = (result.data as Page)?.id;
        if (pageId) {
          router.replace(`/dashboard/admin/pages/${pageId}`);
        }
      }
    } catch {
      toast.error('An unexpected error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Title */}
      <Controller
        name="title"
        control={control}
        render={({ field }) => (
          <TextInput
            id="title"
            label="Title"
            required
            placeholder="e.g., Privacy Policy"
            error={errors.title?.message}
            value={field.value}
            onChange={(e) => {
              field.onChange(e);
              if (!isEditMode) {
                setValue('slug', generateSlug(e.target.value));
              }
            }}
          />
        )}
      />

      {/* Slug */}
      <Controller
        name="slug"
        control={control}
        render={({ field }) => <TextInput id="slug" label="Slug" required placeholder="e.g., privacy-policy" error={errors.slug?.message} {...field} disabled={isEditMode} />}
      />

      {/* Content Editor */}
      <Controller
        name="content"
        control={control}
        render={({ field }) => (
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <TiptapEditor content={field.value} onChange={field.onChange} placeholder="Start writing your page content..." className="border" />
            {errors.content?.message && <p className="text-sm text-destructive">{String(errors.content.message)}</p>}
          </div>
        )}
      />

      {/* Excerpt */}
      <Controller
        name="excerpt"
        control={control}
        render={({ field }) => <TextArea id="excerpt" label="Excerpt" placeholder="Brief summary for SEO (optional)" error={errors.excerpt?.message} rows={2} {...field} />}
      />

      {/* SEO Section */}
      <div className="space-y-4 rounded-lg border p-4">
        <h3 className="font-semibold">SEO Options</h3>

        <Controller
          name="meta_title"
          control={control}
          render={({ field }) => <TextInput id="meta_title" label="Meta Title" placeholder="Custom meta title (optional)" error={errors.meta_title?.message} {...field} />}
        />

        <Controller
          name="meta_description"
          control={control}
          render={({ field }) => (
            <TextArea id="meta_description" label="Meta Description" placeholder="Custom meta description (optional)" error={errors.meta_description?.message} rows={2} {...field} />
          )}
        />
      </div>

      {/* Publish Status */}
      <Controller
        name="is_published"
        control={control}
        render={({ field }) => (
          <div className="flex items-center space-x-2">
            <Switch id="is_published" checked={field.value} onCheckedChange={field.onChange} />
            <Label htmlFor="is_published">Published</Label>
          </div>
        )}
      />

      {/* Actions */}
      <FormActions isSubmitting={isSubmitting} isEditMode={isEditMode} submitLabel="Page" />
    </form>
  );
}
