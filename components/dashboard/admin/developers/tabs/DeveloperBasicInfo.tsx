'use client';

import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { FormActions } from '@/components/shared/forms/FormActions';
import { TextArea } from '@/components/shared/forms/text-area';
import { TextInput } from '@/components/shared/forms/text-input';
import { WidgetCard } from '@/components/shared/WidgetCard';
import { ImageUploader } from '@/components/ui/image-uploader';
import { createDeveloper, updateDeveloper } from '@/lib/db/developers/actions';
import { calculateTrustScore, generateSlug, getTrustScoreLabel } from '@/lib/utils';
import { developerSchema, type DeveloperFormData } from '@/lib/validations/developer';
import type { Developer } from '@/types/developer';
import type { ImageObject } from '@/types/images';

interface DeveloperBasicInfoProps {
  developer?: Developer;
}

function toImageObject(json: unknown): ImageObject | null {
  if (!json || typeof json !== 'object' || Array.isArray(json)) return null;
  const obj = json as Record<string, unknown>;
  if (typeof obj.url === 'string' && typeof obj.alt_tag === 'string') {
    return { url: obj.url, alt_tag: obj.alt_tag };
  }
  return null;
}

export function DeveloperBasicInfo({ developer }: DeveloperBasicInfoProps) {
  const router = useRouter();
  const isEditMode = !!developer;

  const {
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<DeveloperFormData>({
    resolver: zodResolver(developerSchema),
    defaultValues: developer
      ? {
          name: developer.name,
          slug: developer.slug,
          logo_url: toImageObject(developer.logo_url),
          description: developer.description || '',
          website_url: developer.website_url || '',
          delivery_timeliness_score: developer.delivery_timeliness_score ?? 1,
          service_charge_score: developer.service_charge_score ?? 1,
          build_quality_score: developer.build_quality_score ?? 1,
          after_sales_score: developer.after_sales_score ?? 1,
          total_projects: developer.total_projects ?? 0,
          completed_projects: developer.completed_projects ?? 0,
          ongoing_projects: developer.ongoing_projects ?? 0,
          years_active: developer.years_active ?? 0,
        }
      : {
          name: '',
          slug: '',
          logo_url: null,
          description: '',
          website_url: '',
          delivery_timeliness_score: 1,
          service_charge_score: 1,
          build_quality_score: 1,
          after_sales_score: 1,
          total_projects: 0,
          completed_projects: 0,
          ongoing_projects: 0,
          years_active: 0,
        },
  });

  const deliveryTimelinessScore = useWatch({ control, name: 'delivery_timeliness_score' });
  const serviceChargeScore = useWatch({ control, name: 'service_charge_score' });
  const buildQualityScore = useWatch({ control, name: 'build_quality_score' });
  const afterSalesScore = useWatch({ control, name: 'after_sales_score' });

  const computedTrustScore = calculateTrustScore({
    delivery_timeliness_score: deliveryTimelinessScore ?? 1,
    service_charge_score: serviceChargeScore ?? 1,
    build_quality_score: buildQualityScore ?? 1,
    after_sales_score: afterSalesScore ?? 1,
  });
  const { label: trustLabel, variant: trustVariant } = getTrustScoreLabel(computedTrustScore);

  const onSubmit = async (data: DeveloperFormData) => {
    try {
      if (!data.logo_url) {
        toast.error('Developer logo is required');
        return;
      }

      const processedData = {
        ...data,
        logo_url: data.logo_url,
        description: data.description || null,
        website_url: data.website_url || null,
      };

      const result = isEditMode ? await updateDeveloper(developer.id, processedData) : await createDeveloper(processedData);

      if (!result?.success) {
        toast.error(result?.message || 'Failed to save developer');
        return;
      }

      toast.success(isEditMode ? 'Developer updated successfully' : 'Developer created successfully');

      const developerId = isEditMode ? developer.id : (result.data as Developer)?.id;

      if (!isEditMode && developerId) {
        router.replace(`/dashboard/admin/developers/${developerId}`);
      }
    } catch (error) {
      console.error(error);
      toast.error('An unexpected error occurred');
    }
  };

  return (
    <WidgetCard>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Basic Information</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextInput
                  id="name"
                  label="Name"
                  required
                  placeholder="e.g., Emaar Properties"
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

            <Controller
              name="slug"
              control={control}
              render={({ field }) => (
                <div className="grid gap-2">
                  <TextInput id="slug" label="Slug" required placeholder="e.g., emaar-properties" error={errors.slug?.message} {...field} />
                  <p className="text-xs text-muted-foreground">URL-friendly identifier</p>
                </div>
              )}
            />
          </div>

          <Controller
            name="logo_url"
            control={control}
            render={({ field }) => (
              <div className="grid gap-2">
                <Label>
                  Developer Logo <span className="text-destructive">*</span>
                </Label>
                <ImageUploader
                  bucket="developer-logos"
                  folder="logos"
                  value={field.value?.url ? [field.value as ImageObject] : []}
                  onChange={(urls) => {
                    const logoUrl = urls[0] || null;
                    field.onChange(logoUrl);
                    setValue('logo_url', logoUrl, { shouldDirty: true, shouldTouch: true });
                  }}
                  maxImages={1}
                  label="Logo"
                  required
                />
                {errors.logo_url && <p className="text-sm text-destructive">{errors.logo_url.message || 'Developer logo is required'}</p>}
                <p className="text-xs text-muted-foreground">Upload developer logo (JPG, PNG or WebP, max 5MB)</p>
              </div>
            )}
          />

          <Controller
            name="website_url"
            control={control}
            render={({ field }) => (
              <TextInput id="website_url" label="Website URL" type="url" placeholder="https://..." error={errors.website_url?.message} value={field.value || ''} onChange={field.onChange} />
            )}
          />

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextArea id="description" label="Description" placeholder="Developer overview..." error={errors.description?.message} rows={4} value={field.value || ''} onChange={field.onChange} />
            )}
          />
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-medium">Trust Score Components</h3>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">Overall Score:</span>
              <span className="text-lg font-bold">{computedTrustScore}</span>
              <span className="text-sm text-muted-foreground">/100</span>
              <Badge variant={trustVariant}>{trustLabel}</Badge>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Each component is scored from 1-5. The overall Trust Score is converted to 0-100 scale for display.</p>

          <div className="grid gap-4 sm:grid-cols-2">
            <Controller
              name="delivery_timeliness_score"
              control={control}
              render={({ field }) => (
                <TextInput
                  id="delivery_timeliness_score"
                  label="Delivery Timeliness Score (1-5)"
                  type="number"
                  min={1}
                  max={5}
                  value={field.value}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                />
              )}
            />

            <Controller
              name="service_charge_score"
              control={control}
              render={({ field }) => (
                <TextInput
                  id="service_charge_score"
                  label="Service Charge Rating (1-5)"
                  type="number"
                  min={1}
                  max={5}
                  value={field.value}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                />
              )}
            />

            <Controller
              name="build_quality_score"
              control={control}
              render={({ field }) => (
                <TextInput
                  id="build_quality_score"
                  label="Build Quality Score (1-5)"
                  type="number"
                  min={1}
                  max={5}
                  value={field.value}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                />
              )}
            />

            <Controller
              name="after_sales_score"
              control={control}
              render={({ field }) => (
                <TextInput id="after_sales_score" label="After-Sales Support (1-5)" type="number" min={1} max={5} value={field.value} onChange={(e) => field.onChange(parseInt(e.target.value) || 1)} />
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Statistics</h3>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Controller
              name="total_projects"
              control={control}
              render={({ field }) => <TextInput id="total_projects" label="Total Projects" type="number" min={0} value={field.value} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />}
            />

            <Controller
              name="completed_projects"
              control={control}
              render={({ field }) => (
                <TextInput id="completed_projects" label="Completed Projects" type="number" min={0} value={field.value} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
              )}
            />

            <Controller
              name="ongoing_projects"
              control={control}
              render={({ field }) => (
                <TextInput id="ongoing_projects" label="Ongoing Projects" type="number" min={0} value={field.value} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
              )}
            />

            <Controller
              name="years_active"
              control={control}
              render={({ field }) => <TextInput id="years_active" label="Years Active" type="number" min={0} value={field.value} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />}
            />
          </div>
        </div>

        <FormActions isSubmitting={isSubmitting} isEditMode={isEditMode} submitLabel="Developer" />
      </form>
    </WidgetCard>
  );
}

export default DeveloperBasicInfo;
