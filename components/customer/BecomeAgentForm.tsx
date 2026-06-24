'use client';

import { BriefcaseBusiness, Building2, Mail, MapPin, MessageSquareText, Phone, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import BaseForm from '@/components/shared/forms/BaseForm';
import { TextArea } from '@/components/shared/forms/text-area';
import { TextInput } from '@/components/shared/forms/text-input';
import { FormActions } from '@/components/shared/forms/FormActions';
import { WidgetCard } from '@/components/shared/WidgetCard';
import { Badge } from '@/components/ui/badge';
import { PARTNER_APPLICATION_STATUS_BADGE_VARIANTS, PARTNER_APPLICATION_STATUS_LABELS } from '@/config/application';
import { createAgentApplication } from '@/lib/db/partner-applications/actions';
import { agentPartnerApplicationSchema, type AgentPartnerApplicationFormData } from '@/lib/validations/partner-application';
import type { PartnerApplicationWithAgentDetails } from '@/types/partner-application';

interface BecomeAgentFormProps {
  initialData: {
    full_name?: string | null;
    email?: string | null;
  };
  application?: PartnerApplicationWithAgentDetails | null;
}

export function BecomeAgentForm({ initialData, application }: BecomeAgentFormProps) {
  const router = useRouter();
  const hasOpenApplication = application?.status === 'pending' || application?.status === 'reviewing';

  const defaultValues: AgentPartnerApplicationFormData = {
    full_name: initialData.full_name || '',
    email: initialData.email || '',
    phone: '',
    whatsapp: '',
    agency_name: '',
    rera_number: '',
    experience_years: null,
    areas_of_focus: '',
    message: '',
  };

  const onSubmit = async (data: AgentPartnerApplicationFormData) => {
    const result = await createAgentApplication(data);

    if (!result.success) {
      toast.error(result.message || 'Failed to submit application');
      return;
    }

    toast.success('Agent application submitted');
    router.refresh();
  };

  return (
    <div className="space-y-6">
      {application && (
        <WidgetCard icon={BriefcaseBusiness} title="Application Status" description="Your latest agent application.">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant={PARTNER_APPLICATION_STATUS_BADGE_VARIANTS[application.status]}>{PARTNER_APPLICATION_STATUS_LABELS[application.status]}</Badge>
            <p className="text-sm text-muted-foreground">RERA: {application.agent_details?.rera_number || '-'}</p>
          </div>
          {application.admin_notes && <p className="mt-4 whitespace-pre-line rounded-md border bg-muted/30 p-3 text-sm text-muted-foreground">{application.admin_notes}</p>}
        </WidgetCard>
      )}

      <WidgetCard icon={BriefcaseBusiness} title="Agent Application" description="Submit your licensing, brokerage, and focus-area details.">
        {hasOpenApplication ? (
          <p className="text-sm text-muted-foreground">Your application is already under review.</p>
        ) : (
          <BaseForm schema={agentPartnerApplicationSchema} onSubmit={onSubmit} defaultValues={defaultValues} className="space-y-5">
            {(form) => (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  <TextInput
                    icon={User}
                    id="agent-full-name"
                    label="Full name"
                    required
                    placeholder="Your full name"
                    error={form.formState.errors.full_name?.message}
                    {...form.register('full_name')}
                  />
                  <TextInput icon={Mail} id="agent-email" label="Email" required type="email" placeholder="name@example.com" error={form.formState.errors.email?.message} {...form.register('email')} />
                  <TextInput icon={Phone} id="agent-phone" label="Phone" type="tel" placeholder="+971 50 000 0000" error={form.formState.errors.phone?.message} {...form.register('phone')} />
                  <TextInput
                    icon={Phone}
                    id="agent-whatsapp"
                    label="WhatsApp"
                    type="tel"
                    placeholder="+971 50 000 0000"
                    error={form.formState.errors.whatsapp?.message}
                    {...form.register('whatsapp')}
                  />
                  <TextInput
                    icon={Building2}
                    id="agent-agency-name"
                    label="Agency name"
                    placeholder="Agency or brokerage"
                    error={form.formState.errors.agency_name?.message}
                    {...form.register('agency_name')}
                  />
                  <TextInput
                    id="agent-rera-number"
                    label="RERA number"
                    required
                    placeholder="RERA / broker registration number"
                    error={form.formState.errors.rera_number?.message}
                    {...form.register('rera_number')}
                  />
                  <TextInput
                    id="agent-experience"
                    label="Experience years"
                    type="number"
                    min={0}
                    max={80}
                    placeholder="0"
                    error={form.formState.errors.experience_years?.message}
                    {...form.register('experience_years')}
                  />
                  <TextInput
                    icon={MapPin}
                    id="agent-areas"
                    label="Areas of focus"
                    placeholder="Downtown Dubai, Marina..."
                    error={form.formState.errors.areas_of_focus?.message}
                    {...form.register('areas_of_focus')}
                  />
                </div>

                <TextArea
                  icon={MessageSquareText}
                  id="agent-message"
                  label="Message"
                  rows={4}
                  placeholder="Share any extra context for the admin review."
                  error={form.formState.errors.message?.message}
                  {...form.register('message')}
                />

                <FormActions isSubmitting={form.formState.isSubmitting} submitLabel="Application" submitText="Submit Application" />
              </>
            )}
          </BaseForm>
        )}
      </WidgetCard>
    </div>
  );
}
