import { redirect } from 'next/navigation';
import { PartnerOptionCard } from '@/components/customer/PartnerOptionCard';
import { PartnerOnboardingShell } from '@/components/customer/PartnerOnboardingShell';
import { getMyLatestPartnerApplication } from '@/lib/db/partner-applications/queries';

const partnerOptions = [
  {
    title: 'Agent Registration',
    eyebrow: 'Licensed agent',
    description: 'Verified access for brokers and agency representatives.',
    href: '/become-partner/agent',
    icon: 'agent',
    bestFor: 'RERA-licensed brokers',
    requirements: ['RERA number', 'Agency details', 'Areas of focus'],
  },
  {
    title: 'Developer Registration',
    eyebrow: 'Developer company',
    description: 'Company verification for project and analytics workflows.',
    href: '/become-partner/developer',
    icon: 'developer',
    bestFor: 'Developer companies',
    requirements: ['Trade license', 'Company contact', 'Project information'],
  },
] as const;

const verificationSteps = [
  {
    title: 'Choose the right track',
    description: 'Agent and developer applications stay separate from the first step.',
  },
  {
    title: 'Submit verification details',
    description: 'License and company information is captured before access is granted.',
  },
  {
    title: 'Access partner tools',
    description: 'Approved accounts can move into the dashboard with the right role.',
  },
] as const;

export default async function PartnerPage() {
  const { data: application } = await getMyLatestPartnerApplication();

  if (application) {
    redirect('/become-partner/application-status');
  }

  return (
    <PartnerOnboardingShell
      eyebrow="Partner application"
      title="Work with buyers already researching Dubai property decisions"
      description="Choose the partner path that matches your business. Each application collects the right verification details before dashboard access is enabled."
      mediaTitle="Partner access starts with verification"
      mediaDescription="A short review keeps agent and developer dashboards limited to approved businesses."
      mediaFeatures={verificationSteps}
      contentClassName="max-w-2xl"
      fullWidth
      quietMedia
      hideMediaImage
    >
      <div className="mb-6 animate-in fade-in slide-in-from-bottom-3 duration-500 motion-reduce:animate-none">
        <p className="text-sm font-medium text-primary">Step 1 of 2</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-normal text-foreground">Choose the account owner</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Select the track that matches who will manage listings and receive dashboard access after review.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {partnerOptions.map((option, index) => (
          <PartnerOptionCard key={option.href} {...option} animationDelay={`${120 + index * 90}ms`} />
        ))}
      </div>
    </PartnerOnboardingShell>
  );
}
