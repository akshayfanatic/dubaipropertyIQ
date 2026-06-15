import Link from 'next/link';
import { Building2, Home, LineChart, MapPin, Percent, ShieldCheck } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { JsonLd, type SchemaJsonLd } from '@/components/shared/JsonLd';
import { PublicBreadCrumb } from '@/components/shared/PublicBreadCrumb';
import { SectionCard } from '@/components/shared/SectionCard';
import { Badge } from '@/components/ui/badge';
import { calculatePropertyStats, getAreaRentalYieldDescription, getAreaRentalYieldTitle } from '@/lib/utils/programmatic-seo';
import { createBreadcrumbSchema, createFaqPageSchema, createWebPageSchema } from '@/lib/utils/structured-data';
import type { AreaRentalYieldContext } from '@/lib/programmatic-seo/types';
import type { BuildingWithRelations } from '@/types/building';
import { StatTile } from './StatTile';

type AreaRentalYieldProgrammaticPageProps = {
  context: AreaRentalYieldContext;
};

export function AreaRentalYieldProgrammaticPage({ context }: AreaRentalYieldProgrammaticPageProps) {
  const { area, buildings } = context;
  const title = getAreaRentalYieldTitle(area);
  const description = getAreaRentalYieldDescription(area);
  const stats = calculatePropertyStats(area.properties);
  const averageYield = getAverageYield(buildings);
  const highestYieldBuilding = [...buildings].sort((a, b) => (b.rental_yield ?? 0) - (a.rental_yield ?? 0))[0];
  const image = area.photos?.[0] || buildings[0]?.photos?.[0];
  const faqs = area.faqs;
  const schemas: SchemaJsonLd[] = [
    createWebPageSchema({ title, description, path: `/${context.template.slug}`, image: image?.url }),
    createBreadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: area.name, path: getAreaPath(context) },
      { name: title, path: `/${context.template.slug}` },
    ]),
  ];

  if (faqs.length > 0) {
    schemas.push(createFaqPageSchema(faqs));
  }

  return (
    <PageLayout contentFullWidth wrapperClassName="py-0">
      {/* Hero section: summarizes area rental yield using real building-level data. */}
      <SectionCard className="border-b border-border bg-[oklch(0.965_0.012_260.47)] pb-[clamp(2.5rem,6vw,5rem)] pt-0">
        <div className="py-5">
          <PublicBreadCrumb />
        </div>
        <div className="grid gap-8 pt-3 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
          <div className="max-w-4xl space-y-5">
            <Badge variant="outline" className="h-8 gap-2 rounded-full bg-background px-3 font-bold">
              <Percent className="size-3.5" />
              Rental yield
            </Badge>
            <div className="space-y-3">
              <h1 className="text-[clamp(2.25rem,5vw,4.8rem)] font-extrabold leading-[1.02] tracking-normal text-foreground">{title}</h1>
              <p className="max-w-3xl text-base font-medium leading-7 text-muted-foreground sm:text-lg">{description}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 rounded-[22px] border border-border bg-card p-4 shadow-sm">
            <StatTile icon={LineChart} label="Avg yield" value={`${averageYield}%`} />
            <StatTile icon={Building2} label="Source buildings" value={buildings.length.toString()} />
            <StatTile icon={Home} label="Listings" value={stats.listingsCount.toString()} />
            <StatTile icon={ShieldCheck} label="Golden Visa" value={stats.goldenVisaCount.toString()} />
          </div>
        </div>
      </SectionCard>

      {/* Yield body: shows the exact building records used for the area aggregate. */}
      <SectionCard contentClassName="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <main className="min-w-0 space-y-6">
          <div className="overflow-hidden rounded-[22px] border border-border bg-card shadow-sm">
            <div className="grid grid-cols-[1.2fr_0.8fr_1fr] border-b border-border bg-muted/35 px-4 py-3 text-sm font-extrabold text-foreground">
              <div>Building</div>
              <div>Rental yield</div>
              <div>Service charge</div>
            </div>
            {buildings.map((building) => (
              <Link
                key={building.id}
                href={getBuildingPath(building, context)}
                className="grid grid-cols-[1.2fr_0.8fr_1fr] border-b border-border px-4 py-3 text-sm transition-colors last:border-b-0 hover:bg-muted/35"
              >
                <div className="font-bold text-foreground">{building.name}</div>
                <div className="font-medium text-muted-foreground">{typeof building.rental_yield === 'number' ? `${building.rental_yield}%` : 'N/A'}</div>
                <div className="font-medium text-muted-foreground">{typeof building.service_charge_aed_per_sqft === 'number' ? `AED ${building.service_charge_aed_per_sqft}/sqft` : 'N/A'}</div>
              </Link>
            ))}
          </div>

          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-base font-extrabold text-foreground">Yield context</h2>
            <p className="mt-3 text-sm font-medium leading-7 text-muted-foreground">
              The average rental yield shown here is calculated from buildings in {area.name} that have a published rental yield in the database. It is not an area-wide estimate when buildings are
              missing yield data.
            </p>
          </div>

          {faqs.length > 0 && <FAQAccordion faqs={faqs} type="multiple" />}
        </main>

        {/* Related links: connects yield pages to area, search, and strongest source building. */}
        <aside className="space-y-4 lg:sticky lg:top-28">
          <div className="rounded-[22px] border border-border bg-card p-5 shadow-sm">
            <h2 className="text-base font-extrabold text-foreground">Related links</h2>
            <div className="mt-4 grid gap-2">
              <Link href={getAreaPath(context)} className="rounded-xl border border-border px-3 py-2 text-sm font-bold text-foreground transition-colors hover:border-primary/40 hover:text-primary">
                {area.name} area guide
              </Link>
              <Link
                href={`/search?areas=${area.id}`}
                className="rounded-xl border border-border px-3 py-2 text-sm font-bold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                {area.name} listings
              </Link>
              {highestYieldBuilding && (
                <Link
                  href={getBuildingPath(highestYieldBuilding, context)}
                  className="rounded-xl border border-border px-3 py-2 text-sm font-bold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  Highest yield source
                </Link>
              )}
            </div>
          </div>

          <div className="rounded-[22px] border border-border bg-card p-5 shadow-sm">
            <h2 className="flex items-center gap-2 text-base font-extrabold text-foreground">
              <MapPin className="h-5 w-5 text-primary" />
              Data source
            </h2>
            <p className="mt-3 text-sm font-medium leading-7 text-muted-foreground">Rental yield values come from building records linked to {area.name}.</p>
          </div>
        </aside>
      </SectionCard>

      {/* Structured data: exposes webpage, breadcrumb, and real area FAQ entities when available. */}
      <JsonLd id="programmatic-area-rental-yield-structured-data" data={schemas} />
    </PageLayout>
  );
}

function getAverageYield(buildings: BuildingWithRelations[]) {
  const yields = buildings.map((building) => building.rental_yield).filter((value): value is number => typeof value === 'number');
  const total = yields.reduce((sum, value) => sum + value, 0);

  return yields.length > 0 ? (total / yields.length).toFixed(1) : 'N/A';
}

function getAreaPath(context: AreaRentalYieldContext) {
  return `/areas/${context.area.city?.slug ?? 'dubai'}/${context.area.slug}`;
}

function getBuildingPath(building: BuildingWithRelations, context: AreaRentalYieldContext) {
  return `/areas/${building.city?.slug ?? context.area.city?.slug ?? 'dubai'}/${building.area?.slug ?? context.area.slug}/${building.slug}`;
}
