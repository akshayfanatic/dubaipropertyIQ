'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { updateSettings } from '@/lib/db/settings/actions';
import { toast } from 'sonner';
import { TextInput } from '@/components/shared/forms/text-input';
import { FormActions } from '@/components/shared/forms/FormActions';
import { Globe, Building2, Image } from 'lucide-react';
import { WidgetCard } from '@/components/shared/WidgetCard';

const generalSettingsSchema = z.object({
  site_name: z.string().min(2, 'Site name must be at least 2 characters'),
  logo_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

type GeneralSettingsFormData = z.infer<typeof generalSettingsSchema>;

interface GeneralSettingsFormProps {
  initialData?: Record<string, unknown>;
}

export function GeneralSettingsForm({ initialData }: GeneralSettingsFormProps) {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<GeneralSettingsFormData>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      site_name: (initialData?.site_name as string) || '',
      logo_url: (initialData?.logo_url as string) || '',
    },
  });

  const onSubmit = async (data: GeneralSettingsFormData) => {
    try {
      const result = await updateSettings(data);

      if (!result?.success) {
        toast.error(result?.message || 'Failed to update settings');
        return;
      }

      toast.success('General settings updated successfully');
    } catch {
      toast.error('An unexpected error occurred');
    }
  };

  return (
    <WidgetCard icon={Globe} title="General Settings" description="Manage your site identity and branding.">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          <TextInput id="site_name" label="Site Name" required placeholder="Dubai Property IQ" icon={Building2} error={errors.site_name?.message} {...register('site_name')} />

          <TextInput id="logo_url" label="Logo URL" type="url" placeholder="/logo.png" icon={Image} error={errors.logo_url?.message} {...register('logo_url')} />
        </div>
        <FormActions isSubmitting={isSubmitting} isEditMode submitLabel="Settings" />
      </form>
    </WidgetCard>
  );
}
