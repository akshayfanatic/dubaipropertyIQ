'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { BriefcaseBusiness, Building2, Fingerprint, Phone, User } from 'lucide-react';
import BaseForm from '@/components/shared/forms/BaseForm';
import { FormActions } from '@/components/shared/forms/FormActions';
import { TextInput } from '@/components/shared/forms/text-input';
import { AvatarUploader } from '@/components/ui/avatar-uploader';
import { Label } from '@/components/ui/label';
import { updateMyAgentProfile } from '@/lib/db/agent-profile/actions';
import { agentProfileSchema, type AgentProfileFormData } from '@/lib/validations/agent-profile';
import type { Tables } from '@/types/db/supabase-generated';
import { WidgetCard } from '@/components/shared/WidgetCard';
import { useAuth } from '@/providers/auth-provider';

type AgentProfile = Tables<'agent_profiles'>;

interface AgentProfileFormProps {
  profile: AgentProfile;
  avatarUrl?: string | null;
}

export function AgentProfileForm({ profile, avatarUrl }: AgentProfileFormProps) {
  const router = useRouter();
  const { updateProfileState } = useAuth();
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(avatarUrl || null);

  const defaultValues: AgentProfileFormData = {
    contact_name: profile.contact_name,
    phone: profile.phone,
    whatsapp: profile.whatsapp,
    agency_name: profile.agency_name,
    company_name: profile.company_name,
    broker_id: profile.broker_id,
    avatar_url: avatarUrl || null,
  };

  const onSubmit = async (data: AgentProfileFormData) => {
    const result = await updateMyAgentProfile({ ...data, avatar_url: profileImageUrl });

    if (!result.success) {
      toast.error(result.message || 'Failed to update profile');
      return;
    }

    toast.success('Agent profile updated');
    updateProfileState({
      avatarUrl: profileImageUrl,
    });
    router.refresh();
  };

  return (
    <WidgetCard title="Agent profile details" description="Keep your contact and brokerage information accurate for internal review and future listing attribution.">
      <BaseForm schema={agentProfileSchema} onSubmit={onSubmit} defaultValues={defaultValues} className="flex flex-col gap-5">
        {(form) => (
          <>
            <div className="flex flex-col gap-3">
              <Label className="text-sm font-medium text-foreground">Profile image</Label>
              <div className="rounded-xl border border-dashed bg-muted/25 p-4">
                <AvatarUploader
                  bucket="user-profile"
                  value={profileImageUrl}
                  onChange={setProfileImageUrl}
                  disabled={form.formState.isSubmitting}
                  displayName={form.watch('contact_name') || profile.contact_name || profile.email}
                  label="Agent profile image"
                  className="**:data-[slot=avatar]:size-24"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <TextInput
                icon={User}
                id="agent-contact-name"
                label="Contact name"
                placeholder="Your public contact name"
                error={form.formState.errors.contact_name?.message}
                {...form.register('contact_name')}
              />
              <TextInput icon={Phone} id="agent-phone" label="Phone" type="tel" placeholder="+971 50 000 0000" error={form.formState.errors.phone?.message} {...form.register('phone')} />
              <TextInput icon={Phone} id="agent-whatsapp" label="WhatsApp" type="tel" placeholder="+971 50 000 0000" error={form.formState.errors.whatsapp?.message} {...form.register('whatsapp')} />
              <TextInput
                icon={BriefcaseBusiness}
                id="agent-agency-name"
                label="Agency name"
                placeholder="Brokerage or agency"
                error={form.formState.errors.agency_name?.message}
                {...form.register('agency_name')}
              />
              <TextInput
                icon={Building2}
                id="agent-company-name"
                label="Company name"
                placeholder="Registered company name"
                error={form.formState.errors.company_name?.message}
                {...form.register('company_name')}
              />
              <TextInput
                icon={Fingerprint}
                id="agent-broker-id"
                label="Broker ID"
                placeholder="Broker registration ID"
                error={form.formState.errors.broker_id?.message}
                {...form.register('broker_id')}
              />
            </div>

            <FormActions isEditMode isSubmitting={form.formState.isSubmitting} submitLabel="Profile" />
          </>
        )}
      </BaseForm>
    </WidgetCard>
  );
}
