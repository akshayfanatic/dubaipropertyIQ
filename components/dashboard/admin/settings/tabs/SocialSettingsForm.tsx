'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { updateSettings } from '@/lib/db/settings/actions';
import { toast } from 'sonner';
import { TextInput } from '@/components/shared/forms/text-input';
import { FormActions } from '@/components/shared/forms/FormActions';
import { Share2, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { WidgetCard } from '@/components/shared/WidgetCard';

const urlSchema = z.string().url('Must be a valid URL').optional().or(z.literal(''));

const socialSettingsSchema = z.object({
  facebook: urlSchema,
  instagram: urlSchema,
  linkedin: urlSchema,
  twitter: urlSchema,
});

type SocialSettingsFormData = z.infer<typeof socialSettingsSchema>;

interface SocialSettingsFormProps {
  initialData?: Record<string, unknown>;
}

export function SocialSettingsForm({ initialData }: SocialSettingsFormProps) {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<SocialSettingsFormData>({
    resolver: zodResolver(socialSettingsSchema),
    defaultValues: {
      facebook: (initialData?.facebook as string) || '',
      instagram: (initialData?.instagram as string) || '',
      linkedin: (initialData?.linkedin as string) || '',
      twitter: (initialData?.twitter as string) || '',
    },
  });

  const onSubmit = async (data: SocialSettingsFormData) => {
    try {
      const result = await updateSettings(data);

      if (!result?.success) {
        toast.error(result?.message || 'Failed to update settings');
        return;
      }

      toast.success('Social settings updated successfully');
    } catch {
      toast.error('An unexpected error occurred');
    }
  };

  return (
    <WidgetCard icon={Share2} title="Social Settings" description="Manage your social media links displayed in the footer.">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          <TextInput id="facebook" label="Facebook URL" type="url" placeholder="https://facebook.com" icon={Facebook} error={errors.facebook?.message} {...register('facebook')} />

          <TextInput id="instagram" label="Instagram URL" type="url" placeholder="https://instagram.com" icon={Instagram} error={errors.instagram?.message} {...register('instagram')} />

          <TextInput id="linkedin" label="LinkedIn URL" type="url" placeholder="https://linkedin.com" icon={Linkedin} error={errors.linkedin?.message} {...register('linkedin')} />

          <TextInput id="twitter" label="Twitter/X URL" type="url" placeholder="https://twitter.com" icon={Twitter} error={errors.twitter?.message} {...register('twitter')} />
        </div>
        <FormActions isSubmitting={isSubmitting} isEditMode submitLabel="Settings" />
      </form>
    </WidgetCard>
  );
}
