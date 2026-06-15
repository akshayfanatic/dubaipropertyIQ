import Link from 'next/link';
import { AlertCircle, Building2, CheckCircle2, Home, LineChart, MapPin, ShieldCheck } from 'lucide-react';
import { createBuildingReviewFaqs, getBuildingReviewDescription, getBuildingReviewTitle } from '@/lib/utils/programmatic-seo';
import { createBreadcrumbSchema, createBuildingAccommodationSchema, createBuildingWebPageSchema, createFaqPageSchema } from '@/lib/utils/structured-data';
import PageLayout from '@/components/layout/PageLayout';
import { PublicBreadCrumb } from '@/components/shared/PublicBreadCrumb';
import { SectionCard } from '@/components/shared/SectionCard';
import { JsonLd, type SchemaJsonLd } from '@/components/shared/JsonLd';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { Badge } from '@/components/ui/badge';
import { formatPriceOrFallback } from '@/lib/utils/price';
import { BuildingMetricCard } from '@/components/buildings/BuildingMetricCard';
import { BuildingRangeTable } from '@/components/buildings/BuildingRangeTable';
import { StatTile } from './StatTile';
import type { BuildingReviewContext } from '@/lib/programmatic-seo/types';

type BuildingReviewProgrammaticPageProps = {
  context: BuildingReviewContext;
};

export function BuildingReviewProgrammaticPage({ context }: BuildingReviewProgrammaticPageProps) {
  const { building } = context;
  const title = getBuildingReviewTitle(building);
  const description = getBuildingReviewDescription(building);
  const citySlug = building.city?.slug ?? 'dubai';
  const areaSlug = building.area?.slug ?? 'area';
  const detailPath = `/areas/${citySlug}/${areaSlug}/${building.slug}`;
  const faqs = createBuildingReviewFaqs(building);
  const schemas: SchemaJsonLd[] = [
    createBuildingAccommodationSchema(building),
    createBuildingWebPageSchema(building),
    createBreadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: building.area?.name ?? 'Area', path: `/areas/${citySlug}/${areaSlug}` },
      { name: title, path: `/${context.template.slug}` },
    ]),
    createFaqPageSchema(faqs),
  ];
  const locationLine = [building.area?.name, building.city?.name, building.developer?.name].filter(Boolean).join(' | ');

  return (
    <PageLayout contentFullWidth wrapperClassName="py-0">
      {/* Hero section: presents the building review intent and headline metrics. */}
      <SectionCard className="border-b border-border bg-[oklch(0.965_0.012_260.47)] pb-[clamp(2.5rem,6vw,5rem)] pt-0">
        <div className="py-5">
          <PublicBreadCrumb />
        </div>
        <div className="grid gap-8 pt-3 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
          <div className="max-w-4xl space-y-5">
            <Badge variant="outline" className="h-8 gap-2 rounded-full bg-background px-3 font-bold">
              <Building2 className="size-3.5" />
              Building review
            </Badge>
            <div className="space-y-3">
              <h1 className="text-[clamp(2.25rem,5vw,4.8rem)] font-extrabold leading-[1.02] tracking-normal text-foreground">{title}</h1>
              {locationLine && <p className="text-sm font-extrabold leading-6 text-primary">{locationLine}</p>}
              <p className="max-w-3xl text-base font-medium leading-7 text-muted-foreground sm:text-lg">{description}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 rounded-[22px] border border-border bg-card p-4 shadow-sm">
            <StatTile icon={LineChart} label="Avg / sqft" value={formatPriceOrFallback(building.avg_price_per_sqft)} />
            <StatTile icon={Home} label="Rental yield" value={typeof building.rental_yield === 'number' ? `${building.rental_yield}%` : 'N/A'} />
            <StatTile icon={ShieldCheck} label="Service charge" value={typeof building.service_charge_aed_per_sqft === 'number' ? `AED ${building.service_charge_aed_per_sqft}` : 'N/A'} />
            <StatTile icon={Building2} label="Score" value={typeof building.overall_score === 'number' ? `${building.overall_score}/100` : 'N/A'} />
          </div>
        </div>
      </SectionCard>

      {/* Review body: shows metrics, price ranges, tradeoffs, nearby places, and related links. */}
      <SectionCard contentClassName="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <main className="min-w-0 space-y-6">
          <BuildingMetricCard
            items={[
              { label: 'Avg price / sqft', value: formatPriceOrFallback(building.avg_price_per_sqft), badge: 'AED', tone: 'positive' },
              { label: 'Rental yield', value: typeof building.rental_yield === 'number' ? `${building.rental_yield}%` : 'Not available', badge: 'Yield', tone: 'warning' },
              { label: 'Completion', value: building.completion_year ?? 'Not available' },
              { label: 'Demand', value: building.demand_level || 'Not available', badge: building.demand_level || undefined, tone: 'positive' },
            ]}
          />

          {(building.unit_price_ranges.length > 0 || building.rental_ranges.length > 0) && (
            <div className="grid gap-5 xl:grid-cols-2">
              <BuildingRangeTable title="Sale price ranges" ranges={building.unit_price_ranges} />
              <BuildingRangeTable title="Rental ranges" ranges={building.rental_ranges} />
            </div>
          )}

          {(building.pros.length > 0 || building.cons.length > 0) && (
            <div className="grid gap-5 lg:grid-cols-2">
              {building.pros.length > 0 && <ReviewList icon="pros" title="Pros" items={building.pros} />}
              {building.cons.length > 0 && <ReviewList icon="cons" title="Cons" items={building.cons} />}
            </div>
          )}

          {building.nearby_places.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h2 className="text-base font-extrabold text-foreground">Nearby places</h2>
              <div className="mt-4 space-y-3">
                {building.nearby_places.map((place) => (
                  <div key={`${place.name}-${place.distance}`} className="flex items-start gap-3 rounded-lg bg-muted/35 p-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <div>
                      <p className="font-semibold text-foreground">{place.name}</p>
                      <p className="text-sm text-muted-foreground">{[place.type, place.distance].filter(Boolean).join(' | ')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <FAQAccordion faqs={faqs} type="multiple" />
        </main>

        <aside className="space-y-4 lg:sticky lg:top-28">
          <div className="rounded-[22px] border border-border bg-card p-5 shadow-sm">
            <h2 className="text-base font-extrabold text-foreground">Related links</h2>
            <div className="mt-4 grid gap-2">
              <Link href={detailPath} className="rounded-xl border border-border px-3 py-2 text-sm font-bold text-foreground transition-colors hover:border-primary/40 hover:text-primary">
                Full building report
              </Link>
              {building.area?.slug && (
                <Link
                  href={`/areas/${citySlug}/${areaSlug}`}
                  className="rounded-xl border border-border px-3 py-2 text-sm font-bold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  {building.area.name} area guide
                </Link>
              )}
              {building.developer?.slug && (
                <Link
                  href={`/developers/${building.developer.slug}`}
                  className="rounded-xl border border-border px-3 py-2 text-sm font-bold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  {building.developer.name} profile
                </Link>
              )}
            </div>
          </div>
        </aside>
      </SectionCard>

      {/* Structured data: exposes building, webpage, breadcrumb, and FAQ entities to crawlers. */}
      <JsonLd id="programmatic-building-review-structured-data" data={schemas} />
    </PageLayout>
  );
}

function ReviewList({ icon, title, items }: { icon: 'pros' | 'cons'; title: string; items: string[] }) {
  const Icon = icon === 'pros' ? CheckCircle2 : AlertCircle;

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <h2 className="mb-4 flex items-center gap-2 text-base font-extrabold text-foreground">
        <Icon className="h-5 w-5 text-primary" />
        {title}
      </h2>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item} className="text-sm font-medium leading-6 text-muted-foreground">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
