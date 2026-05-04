// app/(frontend)/calculator/rent-vs-buy-calculator/page.tsx

import PageLayout from '@/components/layout/PageLayout';
import { TrueCostCalculator } from '@/components/shared/calculators/rent-vs-buy-calculator/TrueCostCalculator';
import { PublicBreadCrumb } from '@/components/shared/PublicBreadCrumb';
import { SectionCard } from '@/components/shared/SectionCard';
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
    </PageLayout>
  );
}
