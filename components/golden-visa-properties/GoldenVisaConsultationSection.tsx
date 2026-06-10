import Image from 'next/image';
import { LeadCaptureForm } from '@/components/leads/LeadCaptureForm';
import { GoldenVisaBadge } from '@/components/shared/GoldenVisaBadge';
import { staticImages } from '@/config';

export function GoldenVisaConsultationContent() {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,0.86fr)_minmax(24rem,0.64fr)] lg:items-stretch">
      <div className="relative min-h-[430px] overflow-hidden rounded-xl border border-border bg-muted shadow-sm lg:h-full">
        <Image src={staticImages.home.propertyInterior} alt="Dubai property interior for Golden Visa consultation" fill className="object-cover" sizes="(min-width: 1024px) 50vw, 100vw" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,oklch(0.18_0.04_260.47_/_0.78),oklch(0.18_0.04_260.47_/_0.12)_58%,transparent)]" />
        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
          <div className="max-w-md rounded-xl border border-primary-foreground/24 bg-[oklch(0.18_0.04_260.47_/_0.82)] p-5 text-primary-foreground shadow-lg">
            <GoldenVisaBadge variant="gradient-soft" className="mb-4" />
            <h2 className="text-xl font-bold leading-7">Get a property-specific eligibility review</h2>
            <p className="mt-2 text-sm leading-6 text-primary-foreground/84">Share your budget, nationality, and timeline. We will help identify the next practical check.</p>
          </div>
        </div>
      </div>

      <div className="h-full rounded-xl border border-border bg-card p-5 shadow-[0_14px_34px_oklch(0.2_0.03_263.61_/_0.10)] sm:p-6">
        <div className="mb-5 border-b border-border pb-4">
          <h2 className="text-lg font-bold leading-7 text-foreground">Request guidance</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">Required fields help us qualify the enquiry before a call.</p>
        </div>
        <LeadCaptureForm
          sourceType="golden_visa"
          areaOfInterest="Golden Visa Properties"
          showPhone
          requirePhone
          showNationality
          showBudget
          requireBudget
          showTimeline
          requireTimeline
          showMessage
          buttonLabel="Request Golden Visa guidance"
          successMessage="Golden Visa request sent successfully"
          idPrefix="golden-visa"
        />
      </div>
    </div>
  );
}
