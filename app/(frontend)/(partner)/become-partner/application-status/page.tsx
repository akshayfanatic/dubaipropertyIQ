import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowRight, BadgeCheck, Clock3, FileText, XCircle } from 'lucide-react';
import { PartnerOnboardingShell } from '@/components/customer/PartnerOnboardingShell';
import { PartnerApplicationStatusBadge } from '@/components/entity/partner-application/PartnerApplicationStatusBadge';
import { DetailField } from '@/components/shared/DetailField';
import { WidgetCard } from '@/components/shared/WidgetCard';
import { Button } from '@/components/ui/button';
import { requireAuth } from '@/lib/auth/guards';
import { getMyLatestPartnerApplication } from '@/lib/db/partner-applications/queries';
import type { PartnerApplicationStatus, PartnerApplicationWithDetails } from '@/types/partner-application';

const statusCopy: Record<PartnerApplicationStatus, { title: string; description: string }> = {
  pending: {
    title: 'Application submitted',
    description: 'Your application has been received and is waiting for admin review.',
  },
  reviewing: {
    title: 'Application under review',
    description: 'The team is checking your verification details before partner access is enabled.',
  },
  approved: {
    title: 'Application approved',
    description: 'Your application has been approved. Dashboard access will be available once your role is enabled.',
  },
  rejected: {
    title: 'Application rejected',
    description: 'Your application was not approved. Review the note below before submitting again.',
  },
};

function getPrimaryIcon(status: PartnerApplicationStatus) {
  if (status === 'approved') return BadgeCheck;
  if (status === 'rejected') return XCircle;
  return Clock3;
}

function getRoleDetails(application: PartnerApplicationWithDetails) {
  if (application.target_role === 'agent') {
    return [
      ['RERA Number', application.agent_details?.rera_number],
      ['Agency', application.agent_details?.agency_name],
      ['Areas of Focus', application.agent_details?.areas_of_focus],
    ] as const;
  }

  return [
    ['Company', application.developer_details?.company_name],
    ['Trade License', application.developer_details?.trade_license_number],
    ['Website', application.developer_details?.website_url],
  ] as const;
}

export default async function PartnerApplicationStatusPage() {
  await requireAuth();
  const { data: application } = await getMyLatestPartnerApplication();

  if (!application) {
    redirect('/become-partner');
  }

  const Icon = getPrimaryIcon(application.status);
  const copy = statusCopy[application.status];
  return (
    <PartnerOnboardingShell
      eyebrow="Application status"
      title={copy.title}
      description={copy.description}
      imageSrc="/assets/images/developer-bg.webp"
      imageAlt="Dubai real estate partner review workspace"
      points={['Application details are locked during review', 'Admin notes appear here if action is needed', 'Dashboard access starts after approval and role activation']}
      contentClassName="max-w-3xl"
      backHref="/customer"
      backLabel="Back to account"
    >
      <WidgetCard icon={Icon} title={copy.title} description={copy.description}>
        <div className="space-y-6">
          <PartnerApplicationStatusBadge status={application.status} createdAt={application.created_at} role={application.target_role} submittedPrefix="Submitted" />

          <div className="grid gap-3 sm:grid-cols-2">
            <DetailField label="Name" value={application.full_name} />
            <DetailField label="Email" value={application.email} />
            <DetailField label="Phone" value={application.phone} />
            <DetailField label="WhatsApp" value={application.whatsapp} />
            {getRoleDetails(application).map(([label, value]) => (
              <DetailField key={label} label={label} value={value} />
            ))}
          </div>

          {application.admin_notes && (
            <div className="rounded-lg border bg-muted/30 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                <FileText className="h-4 w-4 text-primary" />
                Admin notes
              </div>
              <p className="whitespace-pre-line text-sm leading-6 text-muted-foreground">{application.admin_notes}</p>
            </div>
          )}

          {application.status === 'approved' && (
            <Button asChild className="min-h-11 w-full sm:w-auto">
              <Link href={application.target_role === 'agent' ? '/dashboard/agent' : '/dashboard/developer'}>
                Go to dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </WidgetCard>
    </PartnerOnboardingShell>
  );
}
