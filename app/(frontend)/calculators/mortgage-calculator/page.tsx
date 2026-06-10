// app/(frontend)/calculator/mortgage-calculator/page.tsx
import PageLayout from '@/components/layout/PageLayout';
import { CalculatorPageShell } from '@/components/shared/calculators/CalculatorPageShell';
import { MortgageCalculator } from '@/components/shared/calculators/mortgage-calculator/MortgageCalculator';
import { PublicBreadCrumb } from '@/components/shared/PublicBreadCrumb';
import { Metadata } from 'next';
import { createPageMetadata } from '@/lib/utils/seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Dubai Mortgage Calculator',
  description: 'Calculate your monthly mortgage payments for Dubai properties. Includes amortization schedule, down payment options, and UAE-specific interest rates.',
  path: '/calculators/mortgage-calculator',
  keywords: ['Dubai mortgage calculator', 'UAE mortgage calculator', 'Dubai property loan calculator'],
});

export default function MortgageCalculatorPage() {
  return (
    <PageLayout breadcrumb={<PublicBreadCrumb />}>
      <CalculatorPageShell title="Dubai Mortgage Calculator" description="Estimate monthly payments, down payment requirements, total interest, and yearly amortization for a Dubai property purchase.">
        <MortgageCalculator />
      </CalculatorPageShell>
    </PageLayout>
  );
}
