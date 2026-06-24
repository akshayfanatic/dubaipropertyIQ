import { WidgetCard } from '@/components/shared/WidgetCard';
import { DetailField } from '@/components/shared/DetailField';
import { PartnerApplicationStatusBadge } from '@/components/entity/partner-application/PartnerApplicationStatusBadge';
import type { PartnerApplicationWithAgentDetails } from '@/types/partner-application';

export function AgentApplicationDetails({ application }: { application: PartnerApplicationWithAgentDetails }) {
  return (
    <WidgetCard title="Agent application" description="Applicant contact, license, brokerage, and submitted message." contentClassNames="space-y-5">
      <PartnerApplicationStatusBadge status={application.status} createdAt={application.created_at} />

      <div className="grid gap-4 md:grid-cols-2">
        <DetailField label="Full Name" value={application.full_name} />
        <DetailField label="Email" value={application.email} />
        <DetailField label="Phone" value={application.phone} />
        <DetailField label="WhatsApp" value={application.whatsapp} />
        <DetailField label="Agency" value={application.agent_details?.agency_name} />
        <DetailField label="RERA Number" value={application.agent_details?.rera_number} />
        <DetailField label="Experience Years" value={application.agent_details?.experience_years} />
        <DetailField label="Areas of Focus" value={application.agent_details?.areas_of_focus} />
      </div>

      <div className="space-y-2 rounded-lg border bg-card p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Message</p>
        <p className="whitespace-pre-line text-sm leading-6 text-foreground">{application.agent_details?.message || '-'}</p>
      </div>
    </WidgetCard>
  );
}
