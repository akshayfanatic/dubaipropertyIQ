// app/(frontend)/calculator/mortgage-calculator/page.tsx
import PageLayout from '@/components/layout/PageLayout';
import { MortgageCalculator } from '@/components/shared/calculators/mortgage-calculator/MortgageCalculator';
import { PublicBreadCrumb } from '@/components/shared/PublicBreadCrumb';
import { SectionCard } from '@/components/shared/SectionCard';
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
        align="center"
        classes={{
          wrapper: 'text-center',
        }}
        className="py-0"
      >
        <MortgageCalculator />
      </SectionCard>
    </PageLayout>
  );
}
