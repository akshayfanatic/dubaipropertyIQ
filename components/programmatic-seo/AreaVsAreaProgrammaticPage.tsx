import Link from 'next/link';
import { Building2, CheckCircle2, Home, LineChart, MapPin, ShieldCheck } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { JsonLd, type SchemaJsonLd } from '@/components/shared/JsonLd';
import { PublicBreadCrumb } from '@/components/shared/PublicBreadCrumb';
import { SectionCard } from '@/components/shared/SectionCard';
import { Badge } from '@/components/ui/badge';
import { getAreaVsAreaDescription, getAreaVsAreaTitle, calculatePropertyStats } from '@/lib/utils/programmatic-seo';
import { createBreadcrumbSchema, createFaqPageSchema, createWebPageSchema } from '@/lib/utils/structured-data';
import { formatPriceOrFallback } from '@/lib/utils/price';
import type { AreaVsAreaContext } from '@/lib/programmatic-seo/types';
import type { AreaDetail } from '@/lib/db/areas/queries';
import type { FAQ } from '@/types/shared';
import { StatTile } from './StatTile';

type AreaVsAreaProgrammaticPageProps = {
  context: AreaVsAreaContext;
};

type CompareRow = {
  label: string;
  primary: string;
  secondary: string;
};

export function AreaVsAreaProgrammaticPage({ context }: AreaVsAreaProgrammaticPageProps) {
  const { primaryArea, secondaryArea } = context;
  const title = getAreaVsAreaTitle(primaryArea, secondaryArea);
  const description = getAreaVsAreaDescription(primaryArea, secondaryArea);
  const primaryStats = calculatePropertyStats(primaryArea.properties);
  const secondaryStats = calculatePropertyStats(secondaryArea.properties);
  const faqs = mergeAreaFaqs(primaryArea.faqs, secondaryArea.faqs);
  const image = primaryArea.photos?.[0] || secondaryArea.photos?.[0];
  const rows: CompareRow[] = [
    { label: 'Available listings', primary: primaryStats.listingsCount.toString(), secondary: secondaryStats.listingsCount.toString() },
    { label: 'Average price', primary: formatPriceOrFallback(primaryStats.averagePrice), secondary: formatPriceOrFallback(secondaryStats.averagePrice) },
    { label: 'Average price / sqft', primary: formatPriceOrFallback(primaryStats.averagePricePerSqft), secondary: formatPriceOrFallback(secondaryStats.averagePricePerSqft) },
    { label: 'Golden Visa listings', primary: primaryStats.goldenVisaCount.toString(), secondary: secondaryStats.goldenVisaCount.toString() },
    { label: 'Amenities tracked', primary: primaryArea.amenities.length.toString(), secondary: secondaryArea.amenities.length.toString() },
  ];
  const schemas: SchemaJsonLd[] = [
    createWebPageSchema({ title, description, path: `/${context.template.slug}`, image: image?.url }),
    createBreadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: primaryArea.name, path: getAreaPath(primaryArea) },
      { name: secondaryArea.name, path: getAreaPath(secondaryArea) },
      { name: title, path: `/${context.template.slug}` },
    ]),
  ];

  if (faqs.length > 0) {
    schemas.push(createFaqPageSchema(faqs));
  }

  return (
    <PageLayout contentFullWidth wrapperClassName="py-0">
      {/* Hero section: introduces the real area comparison and summary stats. */}
      <SectionCard className="border-b border-border bg-[oklch(0.965_0.012_260.47)] pb-[clamp(2.5rem,6vw,5rem)] pt-0">
        <div className="py-5">
          <PublicBreadCrumb />
        </div>
        <div className="grid gap-8 pt-3 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
          <div className="max-w-4xl space-y-5">
            <Badge variant="outline" className="h-8 gap-2 rounded-full bg-background px-3 font-bold">
              <MapPin className="size-3.5" />
              Area comparison
            </Badge>
            <div className="space-y-3">
              <h1 className="text-[clamp(2.25rem,5vw,4.8rem)] font-extrabold leading-[1.02] tracking-normal text-foreground">{title}</h1>
              <p className="max-w-3xl text-base font-medium leading-7 text-muted-foreground sm:text-lg">{description}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 rounded-[22px] border border-border bg-card p-4 shadow-sm">
            <StatTile icon={Building2} label={primaryArea.name} value={`${primaryStats.listingsCount} listings`} />
            <StatTile icon={Home} label={secondaryArea.name} value={`${secondaryStats.listingsCount} listings`} />
            <StatTile icon={LineChart} label="Avg price gap" value={getPriceGap(primaryStats.averagePrice, secondaryStats.averagePrice)} />
            <StatTile icon={ShieldCheck} label="Golden Visa" value={`${primaryStats.goldenVisaCount} vs ${secondaryStats.goldenVisaCount}`} />
          </div>
        </div>
      </SectionCard>

      {/* Comparison section: displays side-by-side metrics sourced from each real area. */}
      <SectionCard contentClassName="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <main className="min-w-0 space-y-6">
          <div className="overflow-hidden rounded-[22px] border border-border bg-card shadow-sm">
            <div className="grid grid-cols-[1.1fr_1fr_1fr] border-b border-border bg-muted/35 px-4 py-3 text-sm font-extrabold text-foreground">
              <div>Metric</div>
              <div>{primaryArea.name}</div>
              <div>{secondaryArea.name}</div>
            </div>
            {rows.map((row) => (
              <div key={row.label} className="grid grid-cols-[1.1fr_1fr_1fr] border-b border-border px-4 py-3 text-sm last:border-b-0">
                <div className="font-bold text-foreground">{row.label}</div>
                <div className="font-medium text-muted-foreground">{row.primary}</div>
                <div className="font-medium text-muted-foreground">{row.secondary}</div>
              </div>
            ))}
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <AreaSummary area={primaryArea} />
            <AreaSummary area={secondaryArea} />
          </div>

          {faqs.length > 0 && <FAQAccordion faqs={faqs} type="multiple" />}
        </main>

        {/* Related links: keeps comparison pages connected to canonical area guides and searches. */}
        <aside className="space-y-4 lg:sticky lg:top-28">
          <div className="rounded-[22px] border border-border bg-card p-5 shadow-sm">
            <h2 className="text-base font-extrabold text-foreground">Area links</h2>
            <div className="mt-4 grid gap-2">
              <Link
                href={getAreaPath(primaryArea)}
                className="rounded-xl border border-border px-3 py-2 text-sm font-bold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                {primaryArea.name} area guide
              </Link>
              <Link
                href={getAreaPath(secondaryArea)}
                className="rounded-xl border border-border px-3 py-2 text-sm font-bold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                {secondaryArea.name} area guide
              </Link>
              <Link
                href={`/search?areas=${primaryArea.id}`}
                className="rounded-xl border border-border px-3 py-2 text-sm font-bold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                {primaryArea.name} listings
              </Link>
              <Link
                href={`/search?areas=${secondaryArea.id}`}
                className="rounded-xl border border-border px-3 py-2 text-sm font-bold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                {secondaryArea.name} listings
              </Link>
            </div>
          </div>
        </aside>
      </SectionCard>

      {/* Structured data: exposes webpage, breadcrumb, and real area FAQ entities when available. */}
      <JsonLd id="programmatic-area-vs-area-structured-data" data={schemas} />
    </PageLayout>
  );
}

function AreaSummary({ area }: { area: AreaDetail }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <h2 className="text-base font-extrabold text-foreground">{area.name}</h2>
      <p className="mt-3 text-sm font-medium leading-7 text-muted-foreground">{area.description || 'Area description is not available yet.'}</p>
      {area.amenities.length > 0 && (
        <div className="mt-5 space-y-2">
          {area.amenities.slice(0, 5).map((amenity) => (
            <div key={amenity.id} className="flex items-center gap-2 rounded-lg bg-muted/35 px-3 py-2 text-sm font-semibold text-foreground">
              <CheckCircle2 className="size-4 text-primary" />
              {amenity.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function getAreaPath(area: AreaDetail) {
  return `/areas/${area.city?.slug ?? 'dubai'}/${area.slug}`;
}

function getPriceGap(primaryPrice: number | null, secondaryPrice: number | null) {
  if (typeof primaryPrice !== 'number' || typeof secondaryPrice !== 'number') {
    return 'N/A';
  }

  return formatPriceOrFallback(Math.abs(primaryPrice - secondaryPrice));
}

function mergeAreaFaqs(primaryFaqs: FAQ[] = [], secondaryFaqs: FAQ[] = []) {
  const seenQuestions = new Set<string>();
  const faqs: FAQ[] = [];

  for (const faq of [...primaryFaqs, ...secondaryFaqs]) {
    const question = faq.question.trim().toLowerCase();

    if (!question || seenQuestions.has(question)) {
      continue;
    }

    seenQuestions.add(question);
    faqs.push(faq);
  }

  return faqs;
}
