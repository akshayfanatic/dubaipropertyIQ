import Image from 'next/image';
import Link from 'next/link';
import { BedDouble, Building2, CalendarClock, Home, Ruler, ShieldCheck } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { JsonLd, type SchemaJsonLd } from '@/components/shared/JsonLd';
import { PublicBreadCrumb } from '@/components/shared/PublicBreadCrumb';
import { SectionCard } from '@/components/shared/SectionCard';
import { Badge } from '@/components/ui/badge';
import { getPropertyOffPlanDescription, getPropertyOffPlanTitle } from '@/lib/utils/programmatic-seo';
import { formatPriceOrFallback, formatSize } from '@/lib/utils/price';
import { createBreadcrumbSchema, createFaqPageSchema, createPropertyDetailSchema, createWebPageSchema } from '@/lib/utils/structured-data';
import type { PropertyOffPlanContext } from '@/lib/programmatic-seo/types';
import { StatTile } from './StatTile';

type PropertyOffPlanProgrammaticPageProps = {
  context: PropertyOffPlanContext;
};

export function PropertyOffPlanProgrammaticPage({ context }: PropertyOffPlanProgrammaticPageProps) {
  const { property } = context;
  const title = getPropertyOffPlanTitle(property);
  const description = getPropertyOffPlanDescription(property);
  const heroImage = property.photos?.[0];
  const locationLine = [property.city?.name, property.developer?.name].filter(Boolean).join(' | ');
  const faqs = property.properties_faqs ?? [];
  const searchParams = new URLSearchParams({ status: 'off_plan' });

  if (property.developer?.id) {
    searchParams.set('developer_id', property.developer.id);
  }

  const schemas: SchemaJsonLd[] = [
    createPropertyDetailSchema(property),
    createWebPageSchema({ title, description, path: `/${context.template.slug}`, image: heroImage?.url }),
    createBreadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Off-plan properties', path: '/search?status=off_plan' },
      { name: title, path: `/${context.template.slug}` },
    ]),
  ];

  if (faqs.length > 0) {
    schemas.push(createFaqPageSchema(faqs));
  }

  return (
    <PageLayout contentFullWidth wrapperClassName="py-0">
      {/* Hero section: introduces the off-plan property and core buying signals. */}
      <SectionCard className="border-b border-border bg-[oklch(0.965_0.012_260.47)] pb-[clamp(2.5rem,6vw,5rem)] pt-0">
        <div className="py-5">
          <PublicBreadCrumb />
        </div>
        <div className="grid gap-8 pt-3 lg:grid-cols-[minmax(0,1fr)_26rem] lg:items-end">
          <div className="max-w-4xl space-y-5">
            <Badge variant="outline" className="h-8 gap-2 rounded-full bg-background px-3 font-bold">
              <Building2 className="size-3.5" />
              Off-plan property
            </Badge>
            <div className="space-y-3">
              <h1 className="text-[clamp(2.25rem,5vw,4.8rem)] font-extrabold leading-[1.02] tracking-normal text-foreground">{title}</h1>
              {locationLine && <p className="text-sm font-extrabold leading-6 text-primary">{locationLine}</p>}
              <p className="max-w-3xl text-base font-medium leading-7 text-muted-foreground sm:text-lg">{description}</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-[22px] border border-border bg-card shadow-sm">
            {heroImage?.url ? (
              <div className="relative aspect-[4/3]">
                <Image src={heroImage.url} alt={heroImage.alt_tag || property.title} fill priority sizes="(min-width: 1024px) 26rem, 92vw" className="object-cover" />
              </div>
            ) : (
              <div className="flex aspect-[4/3] items-center justify-center bg-muted text-sm font-bold text-muted-foreground">Property image not available</div>
            )}
          </div>
        </div>
      </SectionCard>

      {/* Property summary: shows price, size, bedroom, and eligibility facts. */}
      <SectionCard contentClassName="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <main className="min-w-0 space-y-6">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatTile icon={Home} label="Launch price" value={formatPriceOrFallback(property.price_aed)} />
            <StatTile icon={BedDouble} label="Bedrooms" value={property.bedrooms ? `${property.bedrooms}` : 'N/A'} />
            <StatTile icon={Ruler} label="Size" value={property.size_sqft ? `${formatSize(property.size_sqft)} sqft` : 'N/A'} />
            <StatTile icon={ShieldCheck} label="Golden Visa" value={property.golden_visa_eligible ? 'Eligible' : 'Check required'} />
          </div>

          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-base font-extrabold text-foreground">Property overview</h2>
            <p className="mt-3 text-sm font-medium leading-7 text-muted-foreground">{property.description}</p>
            {property.features.length > 0 && (
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {property.features.slice(0, 8).map((feature) => (
                  <div key={feature} className="rounded-lg bg-muted/35 px-3 py-2 text-sm font-semibold text-foreground">
                    {feature}
                  </div>
                ))}
              </div>
            )}
          </div>

          {faqs.length > 0 && <FAQAccordion faqs={faqs} type="multiple" />}
        </main>

        {/* Property actions: links users to the canonical detail page and related off-plan inventory. */}
        <aside className="space-y-4 lg:sticky lg:top-28">
          <div className="rounded-[22px] border border-border bg-card p-5 shadow-sm">
            <h2 className="text-base font-extrabold text-foreground">Property links</h2>
            <div className="mt-4 grid gap-2">
              <Link
                href={`/properties/${property.slug}`}
                className="rounded-xl border border-border px-3 py-2 text-sm font-bold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                Full property details
              </Link>
              <Link
                href={`/search?${searchParams.toString()}`}
                className="rounded-xl border border-border px-3 py-2 text-sm font-bold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                More off-plan properties
              </Link>
              {property.developer?.slug && (
                <Link
                  href={`/developers/${property.developer.slug}`}
                  className="rounded-xl border border-border px-3 py-2 text-sm font-bold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  {property.developer.name} profile
                </Link>
              )}
            </div>
          </div>

          <div className="rounded-[22px] border border-border bg-card p-5 shadow-sm">
            <h2 className="flex items-center gap-2 text-base font-extrabold text-foreground">
              <CalendarClock className="h-5 w-5 text-primary" />
              Buyer checks
            </h2>
            <ul className="mt-4 space-y-3 text-sm font-medium leading-6 text-muted-foreground">
              <li>Review payment plan and escrow details before booking.</li>
              <li>Compare launch price with nearby ready and off-plan supply.</li>
              <li>Confirm handover timing, service charges, and Golden Visa eligibility.</li>
            </ul>
          </div>
        </aside>
      </SectionCard>

      {/* Structured data: exposes listing, webpage, breadcrumb, and FAQ entities to crawlers. */}
      <JsonLd id="programmatic-property-off-plan-structured-data" data={schemas} />
    </PageLayout>
  );
}
