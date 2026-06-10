// app/(frontend)/calculator/rent-vs-buy-calculator/page.tsx

import PageLayout from '@/components/layout/PageLayout';
import { JsonLd } from '@/components/shared/JsonLd';
import { CalculatorPageShell } from '@/components/shared/calculators/CalculatorPageShell';
import { TrueCostCalculator } from '@/components/shared/calculators/rent-vs-buy-calculator/TrueCostCalculator';
import { PublicBreadCrumb } from '@/components/shared/PublicBreadCrumb';
import { Metadata } from 'next';
import { createPageMetadata } from '@/lib/utils/seo';
import { createBreadcrumbSchema, createCalculatorSchema } from '@/lib/utils/structured-data';

const pageTitle = 'Dubai Rent vs Buy Calculator';
const pageDescription = 'Compare the long-term cost of renting against buying, including DLD fees, mortgage assumptions, service charges, and rental income.';
const pagePath = '/calculators/rent-vs-buy-calculator';

export const metadata: Metadata = createPageMetadata({
  title: pageTitle,
  description: 'Should you rent or buy in Dubai? Compare total costs including DLD fees, mortgage payments, and all Dubai-specific charges.',
  path: pagePath,
  keywords: ['Dubai rent vs buy calculator', 'rent or buy Dubai', 'Dubai property cost calculator'],
});

export default function RentVsBuyCalculatorPage() {
  return (
    <PageLayout breadcrumb={<PublicBreadCrumb />}>
      <CalculatorPageShell title={pageTitle} description={pageDescription}>
        <TrueCostCalculator />
      </CalculatorPageShell>
      <JsonLd
        id="rent-vs-buy-calculator-structured-data"
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
