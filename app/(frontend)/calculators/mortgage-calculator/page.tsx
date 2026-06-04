// app/(frontend)/calculator/mortgage-calculator/page.tsx
import PageLayout from '@/components/layout/PageLayout';
import { MortgageCalculator } from '@/components/shared/calculators/mortgage-calculator/MortgageCalculator';
import { PublicBreadCrumb } from '@/components/shared/PublicBreadCrumb';
import { SectionCard } from '@/components/shared/SectionCard';
import { CalculatorReportLeadForm } from '@/components/leads/CalculatorReportLeadForm';
import { AnimateSection } from '@/components/shared/AnimateSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mortgage Calculator - Dubai Property',
  description: 'Calculate your monthly mortgage payments for Dubai properties. Includes amortization schedule, down payment options, and UAE-specific interest rates.',
};

export default function MortgageCalculatorPage() {
  return (
    <PageLayout breadcrumb={<PublicBreadCrumb />}>
      <SectionCard
        title="Mortgage Calculator"
        description="Calculate monthly mortgage payments, view amortization schedule, and plan your property purchase in Dubai."
        contentClassName="pt-0"
        classes={{
          wrapper: 'text-center',
        }}
      >
        <MortgageCalculator />
      </SectionCard>

      <AnimateSection>
        <SectionCard
          eyebrow="Detailed report"
          title="Unlock mortgage analysis"
          description="Get the detailed assumptions and next-step guidance behind your mortgage numbers."
          className="pt-0"
          contentClassName="rounded-[18px] border border-border bg-card p-[clamp(1.25rem,3vw,2rem)] shadow-[0_14px_34px_oklch(0.2_0.03_263.61_/_0.10)]"
          classes={{
            wrapper: 'items-center text-center',
            description: 'mx-auto max-w-[560px]',
          }}
        >
          <CalculatorReportLeadForm calculatorName="Mortgage Calculator" />
        </SectionCard>
      </AnimateSection>
    </PageLayout>
  );
}
