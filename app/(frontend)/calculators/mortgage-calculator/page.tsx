// app/(frontend)/calculator/mortgage-calculator/page.tsx
import { MortgageCalculator } from '@/components/shared/calculators/mortgage-calculator/MortgageCalculator';
import { SectionCard } from '@/components/shared/SectionCard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mortgage Calculator - Dubai Property',
  description: 'Calculate your monthly mortgage payments for Dubai properties. Includes amortization schedule, down payment options, and UAE-specific interest rates.',
};

export default function MortgageCalculatorPage() {
  return (
    <>
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
    </>
  );
}
