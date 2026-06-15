import Link from 'next/link';
import { Building2, Home, LineChart, Search, ShieldCheck } from 'lucide-react';
import { getProperties } from '@/lib/db/properties/queries';
import { calculatePropertyStats } from '@/lib/utils/programmatic-seo';
import { createBreadcrumbSchema, createFaqPageSchema, createPropertyItemListSchema, createWebPageSchema } from '@/lib/utils/structured-data';
import { getProgrammaticDescription, getProgrammaticImage, getProgrammaticTitle } from '@/lib/programmatic-seo/metadata';
import { isDeveloperAreaContext } from '@/lib/programmatic-seo/resolve';
import PageLayout from '@/components/layout/PageLayout';
import { PublicBreadCrumb } from '@/components/shared/PublicBreadCrumb';
import { SectionCard } from '@/components/shared/SectionCard';
import { JsonLd, type SchemaJsonLd } from '@/components/shared/JsonLd';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { Pagination } from '@/components/shared/pagination';
import { PropertyCardTile } from '@/components/properties/card';
import { Badge } from '@/components/ui/badge';
import { formatPriceOrFallback } from '@/lib/utils/price';
import { StatTile } from './StatTile';
import type { ListingTemplateContext } from '@/lib/programmatic-seo/types';
import type { PaginatedResult } from '@/types/shared';
import type { PropertyListItem } from '@/types/property';

type ListingProgrammaticPageProps = {
  context: ListingTemplateContext;
  page: number;
};

function getSearchHref(context: ListingTemplateContext) {
  if (isDeveloperAreaContext(context)) {
    return `/search?areas=${context.area.id}&developer_id=${context.developer.id}`;
  }

  return `/search?areas=${context.area.id}&categories=${context.category.id}`;
}

function getBuyingContext(context: ListingTemplateContext) {
  if (isDeveloperAreaContext(context)) {
    return {
      eyebrow: 'Developer context',
      heading: `Buying ${context.developer.name} properties in ${context.area.name}`,
      body: `${context.area.name} buyers comparing ${context.developer.name} properties should review building quality, service charges, handover history, price per sqft, rental demand, transport access, and Golden Visa eligibility before shortlisting.`,
    };
  }

  return {
    eyebrow: 'Buying context',
    heading: `Buying ${context.template.propertyTypeLabel.toLowerCase()} in ${context.area.name}`,
    body: `${context.area.name} buyers should compare price per sqft, developer reputation, building quality, service charges, rental demand, transport access, and Golden Visa eligibility before shortlisting. This page combines available listings with area context so the search intent stays focused.`,
  };
}

function getTemplateFaqs(context: ListingTemplateContext) {
  return context.area.faqs;
}

function getBreadcrumbItems(context: ListingTemplateContext, title: string) {
  const areaPath = `/areas/${context.area.city?.slug ?? 'dubai'}/${context.area.slug}`;

  if (isDeveloperAreaContext(context)) {
    return [
      { name: 'Home', path: '/' },
      { name: context.developer.name, path: `/developers/${context.developer.slug}` },
      { name: context.area.name, path: areaPath },
      { name: title, path: `/${context.template.slug}` },
    ];
  }

  return [
    { name: 'Home', path: '/' },
    { name: context.area.name, path: areaPath },
    { name: title, path: `/${context.template.slug}` },
  ];
}

function getRelatedSearches(context: ListingTemplateContext) {
  const areaGuide = { label: `${context.area.name} area guide`, href: `/areas/${context.area.city?.slug ?? 'dubai'}/${context.area.slug}` };

  if (isDeveloperAreaContext(context)) {
    return [
      areaGuide,
      { label: `${context.developer.name} profile`, href: `/developers/${context.developer.slug}` },
      { label: `${context.area.name} rental yield`, href: `/${context.area.slug}-rental-yield` },
      { label: `${context.area.name} service charges`, href: `/${context.area.slug}-service-charges` },
    ];
  }

  return [
    areaGuide,
    { label: `${context.area.name} rental yield`, href: `/${context.area.slug}-rental-yield` },
    { label: `${context.area.name} service charges`, href: `/${context.area.slug}-service-charges` },
    { label: 'Golden Visa properties', href: '/golden-visa-properties' },
  ];
}

function getPropertyFilters(context: ListingTemplateContext, page: number) {
  const baseFilters = {
    areas: context.area.id,
    page,
    sort: 'newest',
  };

  if (isDeveloperAreaContext(context)) {
    return {
      ...baseFilters,
      developer_id: context.developer.id,
    };
  }

  return {
    ...baseFilters,
    categories: context.category.id,
  };
}

export async function ListingProgrammaticPage({ context, page }: ListingProgrammaticPageProps) {
  const propertiesResponse = await getProperties(getPropertyFilters(context, page));

  if (!propertiesResponse.success || !propertiesResponse.data) {
    return null;
  }

  const result = propertiesResponse.data as PaginatedResult<PropertyListItem>;
  const title = getProgrammaticTitle(context);
  const description = getProgrammaticDescription(context, result.total);
  const stats = calculatePropertyStats(result.data);
  const faqs = getTemplateFaqs(context);
  const image = getProgrammaticImage(context);
  const schemas: SchemaJsonLd[] = [
    createWebPageSchema({ title, description, path: `/${context.template.slug}`, image: image?.url }),
    createPropertyItemListSchema({ name: title, path: `/${context.template.slug}`, properties: result.data }),
    createBreadcrumbSchema(getBreadcrumbItems(context, title)),
  ];

  if (faqs.length > 0) {
    schemas.push(createFaqPageSchema(faqs));
  }
  const relatedSearches = getRelatedSearches(context);
  const buyingContext = getBuyingContext(context);

  return (
    <PageLayout contentFullWidth wrapperClassName="py-0">
      {/* Hero section: introduces the generated listing intent and top-level stats. */}
      <SectionCard className="border-b border-border bg-[oklch(0.965_0.012_260.47)] pb-[clamp(2.5rem,6vw,5rem)] pt-0">
        <div className="py-5">
          <PublicBreadCrumb />
        </div>
        <div className="grid gap-8 pt-3 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
          <div className="max-w-4xl space-y-5">
            <Badge variant="outline" className="h-8 gap-2 rounded-full bg-background px-3 font-bold">
              <Search className="size-3.5" />
              Programmatic property guide
            </Badge>
            <div className="space-y-3">
              <h1 className="text-[clamp(2.25rem,5vw,4.8rem)] font-extrabold leading-[1.02] tracking-normal text-foreground">{title}</h1>
              <p className="max-w-3xl text-base font-medium leading-7 text-muted-foreground sm:text-lg">{description}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 rounded-[22px] border border-border bg-card p-4 shadow-sm">
            <StatTile icon={Building2} label="Listings" value={stats.listingsCount.toString()} />
            <StatTile icon={LineChart} label="Avg price" value={formatPriceOrFallback(stats.averagePrice)} />
            <StatTile icon={Home} label="Avg / sqft" value={formatPriceOrFallback(stats.averagePricePerSqft)} />
            <StatTile icon={ShieldCheck} label="Golden Visa" value={stats.goldenVisaCount.toString()} />
          </div>
        </div>
      </SectionCard>

      {/* Results section: renders matching listings and related programmatic links. */}
      <SectionCard contentClassName="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <main className="min-w-0 space-y-6">
          <div className="flex flex-col gap-2 border-b border-border pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-extrabold leading-7 text-foreground">Available listings</h2>
              <p className="mt-1 text-sm font-medium leading-6 text-muted-foreground">
                Showing {result.total === 0 ? 0 : (result.page - 1) * result.pageSize + 1}-{Math.min(result.page * result.pageSize, result.total)} of {result.total}
              </p>
            </div>
            <Link href={getSearchHref(context)} className="text-sm font-extrabold text-primary hover:underline">
              Open full search
            </Link>
          </div>

          {result.data.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:gap-5">
              {result.data.map((property) => (
                <PropertyCardTile key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="rounded-[22px] border border-border bg-card p-8 text-center">
              <p className="text-base font-bold text-foreground">No matching listings found.</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Add listings for this area and template, or use this page as an SEO landing page while inventory is prepared.</p>
            </div>
          )}

          {result.total > result.pageSize && <Pagination total={result.total} page={result.page} pageSize={result.pageSize} />}
        </main>

        <aside className="space-y-4 lg:sticky lg:top-28">
          <div className="rounded-[22px] border border-border bg-card p-5 shadow-sm">
            <h2 className="text-base font-extrabold text-foreground">Related searches</h2>
            <div className="mt-4 grid gap-2">
              {relatedSearches.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-xl border border-border px-3 py-2 text-sm font-bold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </SectionCard>

      {/* Context section: adds buying guidance and FAQ schema-backed answers. */}
      <SectionCard className="bg-[oklch(0.965_0.012_260.47)] py-[clamp(3rem,7vw,5.5rem)]" contentClassName="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="max-w-2xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-primary">{buyingContext.eyebrow}</p>
          <h2 className="mt-3 text-[clamp(1.7rem,3vw,2.5rem)] font-extrabold leading-tight text-foreground">{buyingContext.heading}</h2>
          <p className="mt-4 text-base font-medium leading-8 text-muted-foreground">{buyingContext.body}</p>
        </div>
        <FAQAccordion faqs={faqs} type="multiple" />
      </SectionCard>

      {/* Structured data: exposes page, listing, breadcrumb, and FAQ entities to crawlers. */}
      <JsonLd id="programmatic-property-type-area-structured-data" data={schemas} />
    </PageLayout>
  );
}
