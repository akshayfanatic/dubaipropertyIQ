// app/(frontend)/calculator/rent-vs-buy-calculator/page.tsx

import PageLayout from '@/components/layout/PageLayout';
import { TrueCostCalculator } from '@/components/shared/calculators/rent-vs-buy-calculator/TrueCostCalculator';
import { PublicBreadCrumb } from '@/components/shared/PublicBreadCrumb';
import { SectionCard } from '@/components/shared/SectionCard';
import { CalculatorReportLeadForm } from '@/components/leads/CalculatorReportLeadForm';
import { AnimateSection } from '@/components/shared/AnimateSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rent vs Buy Calculator - Dubai Property',
  description: 'Should you rent or buy in Dubai? Compare total costs including DLD fees, mortgage payments, and all Dubai-specific charges.',
};

export default function RentVsBuyCalculatorPage() {
  return (
    <PageLayout breadcrumb={<PublicBreadCrumb />}>
      <SectionCard
        title="Rent vs Buy Calculator"
        description="Compare total costs of renting vs buying in Dubai including DLD fees, mortgage payments, and all Dubai-specific charges."
        contentClassName="pt-0"
        classes={{
          wrapper: 'text-center',
        }}
      >
        <TrueCostCalculator />
      </SectionCard>

      <AnimateSection>
        <SectionCard
          eyebrow="Detailed report"
          title="Unlock rent vs buy analysis"
          description="Get the detailed assumptions and next-step guidance behind your comparison."
          className="pt-0"
          contentClassName="rounded-[18px] border border-border bg-card p-[clamp(1.25rem,3vw,2rem)] shadow-[0_14px_34px_oklch(0.2_0.03_263.61_/_0.10)]"
          classes={{
            wrapper: 'items-center text-center',
            description: 'mx-auto max-w-[560px]',
          }}
        >
          <CalculatorReportLeadForm calculatorName="Rent vs Buy Calculator" />
        </SectionCard>
      </AnimateSection>
    </PageLayout>
  );
}
