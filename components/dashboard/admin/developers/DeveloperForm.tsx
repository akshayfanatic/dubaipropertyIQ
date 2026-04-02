'use client';

import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { developerSchema, DeveloperFormData } from '@/lib/validations/developer';
import { createDeveloper, updateDeveloper } from '@/lib/db/developers/actions';
import { Developer } from '@/types/developer';
import { calculateTrustScore, getTrustScoreLabel, generateSlug } from '@/lib/utils';
import { ImageUploader } from '@/components/ui/image-uploader';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

interface DeveloperFormProps {
  developer?: Developer;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function DeveloperForm({ developer, onSuccess, onCancel }: DeveloperFormProps) {
  const router = useRouter();
  const isEditMode = !!developer;

  const {
    register,
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
          logo_url: developer.logo_url || null,
          description: developer.description || '',
          website_url: developer.website_url || '',
          delivery_timeliness_score: developer.delivery_timeliness_score,
          service_charge_score: developer.service_charge_score,
          build_quality_score: developer.build_quality_score,
          after_sales_score: developer.after_sales_score,
          total_projects: developer.total_projects,
          completed_projects: developer.completed_projects,
          ongoing_projects: developer.ongoing_projects,
          years_active: developer.years_active,
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

  // Watch trust score values for live preview
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
      // Convert empty strings to null for optional URL fields
      const processedData = {
        ...data,
        logo_url: data.logo_url || null,
        description: data.description || null,
        website_url: data.website_url || null,
      };

      const result = isEditMode ? await updateDeveloper(developer!.id, processedData) : await createDeveloper(processedData);

      if (!result?.success) {
        toast.error(result?.message || 'Failed to save developer');
        return;
      }

      toast.success(isEditMode ? 'Developer updated successfully' : 'Developer created successfully');
      onSuccess?.();
      router.push('/dashboard/admin/developers');
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error('An unexpected error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Basic Information</h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Emaar Properties"
              {...register('name', {
                onBlur: (e) => {
                  setValue('slug', generateSlug(e.target.value));
                },
              })}
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input id="slug" placeholder="e.g., emaar-properties" {...register('slug')} className={errors.slug ? 'border-destructive' : ''} />
            {errors.slug && <p className="text-sm text-destructive">{errors.slug.message}</p>}
            <p className="text-xs text-muted-foreground">URL-friendly identifier</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Developer Logo</Label>
          <Controller
            name="logo_url"
            control={control}
            render={({ field }) => (
              <ImageUploader
                bucket="developer-logos"
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
            )}
          />
          <p className="text-xs text-muted-foreground">Upload developer logo (JPG, PNG or WebP, max 5MB)</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="website_url">Website URL</Label>
          <Input id="website_url" type="url" placeholder="https://..." {...register('website_url')} className={errors.website_url ? 'border-destructive' : ''} />
          {errors.website_url && <p className="text-sm text-destructive">{errors.website_url.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            placeholder="Developer overview..."
            rows={4}
            {...register('description')}
            className={`w-full rounded-md border bg-transparent px-3 py-2 text-sm ${errors.description ? 'border-destructive' : 'border-input'}`}
          />
          {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
        </div>
      </div>

      {/* Trust Score Components */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Trust Score Components</h3>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">Overall Score:</span>
            <span className="font-bold text-lg">{computedTrustScore}</span>
            <span className="text-muted-foreground text-sm">/100</span>
            <Badge variant={trustVariant}>{trustLabel}</Badge>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">Each component is scored from 1-5. The overall Trust Score is converted to 0-100 scale for display.</p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="delivery_timeliness_score">Delivery Timeliness Score (1-5)</Label>
            <Controller
              name="delivery_timeliness_score"
              control={control}
              render={({ field }) => <Input id="delivery_timeliness_score" type="number" min={1} max={5} value={field.value} onChange={(e) => field.onChange(parseInt(e.target.value) || 1)} />}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="service_charge_score">Service Charge Rating (1-5)</Label>
            <Controller
              name="service_charge_score"
              control={control}
              render={({ field }) => <Input id="service_charge_score" type="number" min={1} max={5} value={field.value} onChange={(e) => field.onChange(parseInt(e.target.value) || 1)} />}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="build_quality_score">Build Quality Score (1-5)</Label>
            <Controller
              name="build_quality_score"
              control={control}
              render={({ field }) => <Input id="build_quality_score" type="number" min={1} max={5} value={field.value} onChange={(e) => field.onChange(parseInt(e.target.value) || 1)} />}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="after_sales_score">After-Sales Support (1-5)</Label>
            <Controller
              name="after_sales_score"
              control={control}
              render={({ field }) => <Input id="after_sales_score" type="number" min={1} max={5} value={field.value} onChange={(e) => field.onChange(parseInt(e.target.value) || 1)} />}
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Statistics</h3>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="total_projects">Total Projects</Label>
            <Controller
              name="total_projects"
              control={control}
              render={({ field }) => <Input id="total_projects" type="number" min={0} value={field.value} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="completed_projects">Completed Projects</Label>
            <Controller
              name="completed_projects"
              control={control}
              render={({ field }) => <Input id="completed_projects" type="number" min={0} value={field.value} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ongoing_projects">Ongoing Projects</Label>
            <Controller
              name="ongoing_projects"
              control={control}
              render={({ field }) => <Input id="ongoing_projects" type="number" min={0} value={field.value} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="years_active">Years Active</Label>
            <Controller
              name="years_active"
              control={control}
              render={({ field }) => <Input id="years_active" type="number" min={0} value={field.value} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-6 border-t">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="cursor-pointer">
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting} className="cursor-pointer min-w-30">
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {isEditMode ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {isEditMode ? 'Update Developer' : 'Create Developer'}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
