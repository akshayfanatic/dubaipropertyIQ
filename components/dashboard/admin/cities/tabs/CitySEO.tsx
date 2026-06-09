'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Globe2, Image as ImageIcon, Link2, Tags } from 'lucide-react';
import { FormActions } from '@/components/shared/forms/FormActions';
import { TextArea } from '@/components/shared/forms/text-area';
import { TextInput } from '@/components/shared/forms/text-input';
import { WidgetCard } from '@/components/shared/WidgetCard';
import { saveCitySEO } from '@/lib/db/cities/actions';
import { citySeoFormSchema, type CitySEOFormData, type CitySEOFormInput } from '@/lib/validations/city';
import type { CitySEO as CitySEOData } from '@/types/city';

interface CitySEOProps {
  cityId?: string;
  seo?: CitySEOData | null;
}

export function CitySEO({ cityId, seo }: CitySEOProps) {
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CitySEOFormInput, unknown, CitySEOFormData>({
    resolver: zodResolver(citySeoFormSchema),
    defaultValues: {
      meta_title: seo?.meta_title ?? '',
      meta_description: seo?.meta_description ?? '',
      keywords: seo?.keywords ?? '',
      og_image_url: seo?.og_image_url ?? '',
      canonical_url: seo?.canonical_url ?? '',
    },
  });

  const onSubmit = async (data: CitySEOFormData) => {
    if (!cityId) {
      toast.error('Please save the city basic details first');
      return;
    }

    const result = await saveCitySEO(cityId, data);

    if (!result.success) {
      toast.error(result.message || 'Failed to save city SEO');
      return;
    }

    toast.success('City SEO saved successfully');
  };

  return (
    <WidgetCard title="SEO Metadata" description="Control search snippets, social previews, and canonical indexing for this city.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Controller
          name="meta_title"
          control={control}
          render={({ field }) => <TextInput id="meta_title" label="Meta Title" placeholder="Dubai Areas & Communities" error={errors.meta_title?.message} {...field} value={field.value ?? ''} />}
        />

        <Controller
          name="meta_description"
          control={control}
          render={({ field }) => (
            <TextArea
              id="meta_description"
              label="Meta Description"
              placeholder="Write a concise search result description for this city."
              rows={3}
              error={errors.meta_description?.message}
              {...field}
              value={field.value ?? ''}
            />
          )}
        />

        <Controller
          name="keywords"
          control={control}
          render={({ field }) => (
            <TextInput
              id="keywords"
              label="Keywords"
              placeholder="dubai areas, dubai communities, properties in dubai"
              icon={Tags}
              error={errors.keywords?.message}
              {...field}
              value={field.value ?? ''}
            />
          )}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <Controller
            name="og_image_url"
            control={control}
            render={({ field }) => (
              <TextInput
                id="og_image_url"
                label="Open Graph Image URL"
                placeholder="https://example.com/city.jpg"
                icon={ImageIcon}
                error={errors.og_image_url?.message}
                {...field}
                value={field.value ?? ''}
              />
            )}
          />

          <Controller
            name="canonical_url"
            control={control}
            render={({ field }) => (
              <TextInput
                id="canonical_url"
                label="Canonical URL"
                placeholder="https://dubaipropertyiq.com/areas/city-slug"
                icon={Link2}
                error={errors.canonical_url?.message}
                {...field}
                value={field.value ?? ''}
              />
            )}
          />
        </div>

        <div className="flex items-center gap-2 rounded-md border bg-muted/35 px-3 py-2 text-sm text-muted-foreground">
          <Globe2 className="h-4 w-4 shrink-0" />
          <span>Empty fields fall back to the city name, description, image, and page URL.</span>
        </div>

        <FormActions isSubmitting={isSubmitting} isEditMode={!!seo} submitLabel="SEO" />
      </form>
    </WidgetCard>
  );
}

export default CitySEO;
