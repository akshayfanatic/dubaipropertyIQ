import { notFound } from 'next/navigation';
import { AgentApplicationDetails } from '@/components/entity/partner-application/agent-application/AgentApplicationDetails';
import { AgentApplicationReviewForm } from '@/components/entity/partner-application/agent-application/AgentApplicationReviewForm';
import { PartnerApplicationReviewLayout } from '@/components/entity/partner-application/PartnerApplicationReviewLayout';
import { getAgentApplicationByIdAdmin } from '@/lib/db/partner-applications/queries';

interface AdminApplicationPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminApplicationPage({ params }: AdminApplicationPageProps) {
  const { id } = await params;
  const { success, data: application } = await getAgentApplicationByIdAdmin(id);

  if (!success || !application) {
    notFound();
  }

  return (
    <PartnerApplicationReviewLayout title={application.full_name} description="Application review" actions={<AgentApplicationReviewForm application={application} />}>
      <AgentApplicationDetails application={application} />
    </PartnerApplicationReviewLayout>
  );
}
