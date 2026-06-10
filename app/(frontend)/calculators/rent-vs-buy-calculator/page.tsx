// app/(frontend)/calculator/rent-vs-buy-calculator/page.tsx

import PageLayout from '@/components/layout/PageLayout';
import { CalculatorPageShell } from '@/components/shared/calculators/CalculatorPageShell';
import { TrueCostCalculator } from '@/components/shared/calculators/rent-vs-buy-calculator/TrueCostCalculator';
import { PublicBreadCrumb } from '@/components/shared/PublicBreadCrumb';
import { Metadata } from 'next';
import { createPageMetadata } from '@/lib/utils/seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Dubai Rent vs Buy Calculator',
  description: 'Should you rent or buy in Dubai? Compare total costs including DLD fees, mortgage payments, and all Dubai-specific charges.',
  path: '/calculators/rent-vs-buy-calculator',
  keywords: ['Dubai rent vs buy calculator', 'rent or buy Dubai', 'Dubai property cost calculator'],
});

export default function RentVsBuyCalculatorPage() {
  return (
    <PageLayout breadcrumb={<PublicBreadCrumb />}>
      <CalculatorPageShell
        title="Dubai Rent vs Buy Calculator"
        description="Compare the long-term cost of renting against buying, including DLD fees, mortgage assumptions, service charges, and rental income."
      >
        <TrueCostCalculator />
      </CalculatorPageShell>
    </PageLayout>
  );
}
