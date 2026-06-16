'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { blogSchema, BlogFormData } from '@/lib/validations/blog';
import { createBlog, updateBlog } from '@/lib/db/blogs/actions';
import { Blog } from '@/types/blog';
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
import { ImageUploader } from '@/components/ui/image-uploader';
import useSWR from 'swr';
import { SelectField } from '@/components/shared/select-field';
import type { BlogCategoryOption } from '@/types/blog-category';
import type { BlogTagOption } from '@/types/blog-tag';
import { MultiSelect } from '@/components/ui/multi-select';

interface BlogFormProps {
  id?: string;
  blog?: Blog;
}

export function BlogForm({ id = '', blog }: BlogFormProps) {
  const router = useRouter();
  const isEditMode = !!id;
  const { data: blogCategories = [], isLoading: isLoadingBlogCategories } = useSWR<BlogCategoryOption[]>('/api/admin/blogs/categories/options');
  const { data: blogTags = [], isLoading: isLoadingBlogTags } = useSWR<BlogTagOption[]>('/api/admin/blogs/tags/options');
  const blogTagOptions = blogTags.map((tag) => ({ label: tag.label, value: tag.value }));

  const {
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: '',
      slug: '',
      category_id: null,
      tag_ids: [],
      feature_image_url: { url: '', alt_tag: '' },
      content: { type: 'doc', content: [] },
      excerpt: '',
      meta_title: '',
      meta_description: '',
      is_published: false,
    },
  });

  useEffect(() => {
    if (blog) {
      reset({
        title: blog.title,
        slug: blog.slug,
        category_id: blog.category_id ?? null,
        tag_ids: blog.blog_post_tags?.map((tag) => tag.tag_id) ?? [],
        feature_image_url: blog.feature_image_url || { url: '', alt_tag: '' },
        content: blog.content as BlogFormData['content'],
        excerpt: blog.excerpt || '',
        meta_title: blog.blogs_seo?.meta_title || '',
        meta_description: blog.blogs_seo?.meta_description || '',
        is_published: blog.is_published ?? false,
      });
    }
  }, [blog, reset]);

  const onSubmit = async (data: BlogFormData) => {
    try {
      const result = isEditMode ? await updateBlog(id, data) : await createBlog(data);

      if (!result?.success) {
        toast.error(result?.message || 'Failed to save blog');
        return;
      }

      toast.success(isEditMode ? 'Blog updated successfully' : 'Blog created successfully');

      if (!isEditMode && result.data) {
        const blogId = (result.data as Blog)?.id;
        if (blogId) {
          router.replace(`/dashboard/admin/blogs/${blogId}`);
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
            placeholder="e.g., Dubai Property Market Outlook"
            error={errors.title?.message}
            value={field.value}
            onChange={(e) => {
              field.onChange(e);
              if (!isEditMode) {
                setValue('slug', generateSlug(e.target.value), { shouldDirty: true, shouldValidate: true });
              }
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
            <TextInput id="slug" label="Slug" required placeholder="e.g., dubai-property-market-outlook" error={errors.slug?.message} {...field} disabled={isEditMode} />
            <p className="text-xs text-muted-foreground">Auto-generated from title while creating a blog.</p>
          </div>
        )}
      />

      {/* Category */}
      <Controller
        name="category_id"
        control={control}
        render={({ field }) => (
          <div className="grid gap-2">
            <Label htmlFor="category_id">Category</Label>
            <SelectField
              options={blogCategories}
              placeholder={isLoadingBlogCategories ? 'Loading categories...' : 'Select a category'}
              value={field.value ?? ''}
              onValueChange={(value) => field.onChange(value || null)}
              className="w-full"
              disabled={isLoadingBlogCategories}
            />
            {errors.category_id && <p className="text-sm text-destructive">{errors.category_id.message}</p>}
          </div>
        )}
      />

      {/* Tags */}
      <Controller
        name="tag_ids"
        control={control}
        render={({ field }) => (
          <MultiSelect
            name="tag_ids"
            label="Tags"
            options={blogTagOptions}
            value={field.value ?? []}
            onChange={field.onChange}
            placeholder="Select tags"
            disabled={isLoadingBlogTags}
            isLoading={isLoadingBlogTags}
            error={errors.tag_ids?.message}
          />
        )}
      />

      {/* Feature Image */}
      <Controller
        name="feature_image_url"
        control={control}
        render={({ field }) => (
          <div className="grid gap-2">
            <Label>
              Featured Image
              <span className="text-destructive ml-1">*</span>
            </Label>
            <ImageUploader
              bucket="blog-images"
              folder="blogs"
              value={field.value?.url ? [field.value] : []}
              onChange={(images) => {
                const featuredImage = images[0] || { url: '', alt_tag: '' };
                field.onChange(featuredImage);
                setValue('feature_image_url', featuredImage, { shouldDirty: true, shouldTouch: true });
              }}
              maxImages={1}
              label="Featured Image"
              required
            />
            {errors.feature_image_url && <p className="text-base text-destructive">{errors.feature_image_url.message || 'Featured image is required'}</p>}
            <p className="text-xs text-muted-foreground">Upload featured image (JPG, PNG, WebP or SVG, max 5MB)</p>
          </div>
        )}
      />

      {/* Content Editor */}
      <Controller
        name="content"
        control={control}
        render={({ field }) => (
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <TiptapEditor content={field.value} onChange={field.onChange} placeholder="Start writing your blog post..." className="border" />
            {errors.content?.message && <p className="text-sm text-destructive">{String(errors.content.message)}</p>}
          </div>
        )}
      />

      {/* Excerpt */}
      <Controller
        name="excerpt"
        control={control}
        render={({ field }) => <TextArea id="excerpt" label="Excerpt" placeholder="Brief summary for previews and SEO (optional)" error={errors.excerpt?.message} rows={2} {...field} />}
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
      <FormActions isSubmitting={isSubmitting} isEditMode={isEditMode} submitLabel="Blog" />
    </form>
  );
}
