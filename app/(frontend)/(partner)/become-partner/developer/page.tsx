import { Building2, CheckCircle2, Clock3, ClipboardCheck } from 'lucide-react';
import { redirect } from 'next/navigation';
import { PartnerOnboardingShell } from '@/components/customer/PartnerOnboardingShell';
import { WidgetCard } from '@/components/shared/WidgetCard';
import { Button } from '@/components/ui/button';
import { getMyLatestPartnerApplication } from '@/lib/db/partner-applications/queries';

const developerRequirements = ['Company or developer name', 'Trade license number', 'Authorized contact person', 'Website and active project details'];

export default async function PartnerDeveloperRegistrationPage() {
  const { data: application } = await getMyLatestPartnerApplication();

  if (application) {
    redirect('/become-partner/application-status');
  }

  return (
    <PartnerOnboardingShell
      eyebrow="Developer registration"
      title="Prepare your developer profile for review"
      description="Developer applications will collect company licensing, authorized contact details, and project information before dashboard access is enabled."
      imageSrc="/assets/images/developer-form.webp"
      imageAlt="Dubai development and architecture scene"
      points={['Trade license details', 'Authorized company contact', 'Project information for review']}
      contentClassName="max-w-3xl"
      backHref="/become-partner"
      backLabel="Back to partner options"
    >
      <div className="mb-6 rounded-2xl border bg-card p-6 shadow-lg shadow-foreground/5 sm:p-7">
        <div className="mb-4 inline-flex items-center gap-2 rounded-md bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
          <ClipboardCheck className="h-4 w-4" />
          Step 2 of 2
        </div>
        <h2 className="text-2xl font-semibold tracking-normal text-foreground">Developer verification details</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          This path is reserved for company-owned partner accounts. The form will collect license, contact, and project information.
        </p>
      </div>

      <WidgetCard icon={Building2} title="Developer Registration" description="Company verification flow for developer partners.">
        <div className="space-y-6">
          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="flex items-start gap-3">
              <Clock3 className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">Developer form scaffold is next</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  This page is intentionally separated so the developer application can collect company-specific details without mixing them into the agent form.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {developerRequirements.map((requirement) => (
              <div key={requirement} className="flex min-h-11 items-center gap-2 rounded-md border bg-background px-3 text-sm text-foreground">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                {requirement}
              </div>
            ))}
          </div>

          <Button type="button" disabled className="min-h-11 w-full sm:w-auto">
            Developer form coming next
          </Button>
        </div>
      </WidgetCard>
    </PartnerOnboardingShell>
  );
}
