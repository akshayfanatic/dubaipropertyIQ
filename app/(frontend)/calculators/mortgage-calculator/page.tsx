// app/(frontend)/calculator/mortgage-calculator/page.tsx
import PageLayout from '@/components/layout/PageLayout';
import { JsonLd } from '@/components/shared/JsonLd';
import { CalculatorPageShell } from '@/components/shared/calculators/CalculatorPageShell';
import { MortgageCalculator } from '@/components/shared/calculators/mortgage-calculator/MortgageCalculator';
import { PublicBreadCrumb } from '@/components/shared/PublicBreadCrumb';
import { Metadata } from 'next';
import { createPageMetadata } from '@/lib/utils/seo';
import { createBreadcrumbSchema, createCalculatorSchema } from '@/lib/utils/structured-data';

const pageTitle = 'Dubai Mortgage Calculator';
const pageDescription = 'Estimate monthly payments, down payment requirements, total interest, and yearly amortization for a Dubai property purchase.';
const pagePath = '/calculators/mortgage-calculator';

export const metadata: Metadata = createPageMetadata({
  title: pageTitle,
  description: 'Calculate your monthly mortgage payments for Dubai properties. Includes amortization schedule, down payment options, and UAE-specific interest rates.',
  path: pagePath,
  keywords: ['Dubai mortgage calculator', 'UAE mortgage calculator', 'Dubai property loan calculator'],
});

export default function MortgageCalculatorPage() {
  return (
    <PageLayout breadcrumb={<PublicBreadCrumb />}>
      <CalculatorPageShell title={pageTitle} description={pageDescription}>
        <MortgageCalculator />
      </CalculatorPageShell>
      <JsonLd
        id="mortgage-calculator-structured-data"
        data={[
          createCalculatorSchema({
            name: pageTitle,
            description: pageDescription,
            path: pagePath,
          }),
          createBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: pageTitle, path: pagePath },
          ]),
        ]}
      />
    </PageLayout>
  );
}
