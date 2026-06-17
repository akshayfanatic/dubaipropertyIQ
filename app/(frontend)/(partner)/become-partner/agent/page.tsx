import { BecomeAgentForm } from '@/components/customer/BecomeAgentForm';
import { PartnerOnboardingShell } from '@/components/customer/PartnerOnboardingShell';
import { requireAuth } from '@/lib/auth/guards';
import { getMyAgentApplication } from '@/lib/db/partner-applications/queries';
import { redirect } from 'next/navigation';

export default async function PartnerAgentRegistrationPage() {
  const user = await requireAuth();
  const { data: application } = await getMyAgentApplication();

  if (application) {
    redirect('/become-partner/application-status');
  }

  return (
    <PartnerOnboardingShell
      eyebrow="Agent registration"
      title="Submit your agent details for partner review"
      description="Share your licensing and brokerage details so the team can verify your application before enabling agent dashboard access."
      imageSrc="https://images.pexels.com/photos/8815820/pexels-photo-8815820.jpeg?auto=compress&cs=tinysrgb&w=1800"
      imageAlt="Real estate agent conducting a home tour with potential buyers"
      points={['RERA number required', 'Brokerage and focus areas captured', 'Admin review before access']}
      contentClassName="max-w-3xl"
      backHref="/become-partner"
      backLabel="Back to partner options"
      quietMedia
      hideMediaContent
    >
      <BecomeAgentForm
        initialData={{
          full_name: user.user_metadata?.display_name || '',
          email: user.email || '',
        }}
        application={application}
      />
    </PartnerOnboardingShell>
  );
}
