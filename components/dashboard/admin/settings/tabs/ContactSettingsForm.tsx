'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { updateSettings } from '@/lib/db/settings/actions';
import { toast } from 'sonner';
import { TextInput } from '@/components/shared/forms/text-input';
import { TextArea } from '@/components/shared/forms/text-area';
import { FormActions } from '@/components/shared/forms/FormActions';
import { WidgetCard } from '@/components/shared/WidgetCard';
import { Phone, Mail, PhoneCall } from 'lucide-react';

const contactSettingsSchema = z.object({
  email: z.string().email('Must be a valid email address'),
  phone: z.string().min(5, 'Phone number must be at least 5 characters'),
  whatsapp: z.string().min(5, 'Phone number must be at least 5 characters'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
});

type ContactSettingsFormData = z.infer<typeof contactSettingsSchema>;

interface ContactSettingsFormProps {
  initialData?: Record<string, unknown>;
}

export function ContactSettingsForm({ initialData }: ContactSettingsFormProps) {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<ContactSettingsFormData>({
    resolver: zodResolver(contactSettingsSchema),
    defaultValues: {
      email: (initialData?.email as string) || '',
      phone: (initialData?.phone as string) || '',
      whatsapp: (initialData?.whatsapp as string) || '',
      address: (initialData?.address as string) || '',
    },
  });

  const onSubmit = async (data: ContactSettingsFormData) => {
    try {
      const result = await updateSettings(data);

      if (!result?.success) {
        toast.error(result?.message || 'Failed to update settings');
        return;
      }

      toast.success('Contact settings updated successfully');
    } catch {
      toast.error('An unexpected error occurred');
    }
  };

  return (
    <WidgetCard icon={Phone} title="Contact Settings" description="Manage your contact information displayed across the site.">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          <TextInput icon={Mail} id="email" label="Email Address" required type="email" placeholder="info@dubaipropertyiq.com" error={errors.email?.message} {...register('email')} />

          <TextInput icon={Phone} id="phone" label="Phone Number" required type="number" placeholder="+971 4 123 4567" error={errors.phone?.message} {...register('phone')} />

          <TextInput icon={PhoneCall} id="whatsapp" label="WhatsApp Number" required type="number" placeholder="+971 50 123 4567" error={errors.whatsapp?.message} {...register('whatsapp')} />

          <TextArea id="address" label="Address" required placeholder="Dubai Marina, Dubai, UAE" error={errors.address?.message} rows={3} {...register('address')} />
        </div>
        <FormActions isSubmitting={isSubmitting} isEditMode submitLabel="Settings" />
      </form>
    </WidgetCard>
  );
}
