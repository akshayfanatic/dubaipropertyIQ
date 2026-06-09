import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { AlertCircle, Building2, CheckCircle2, Download, MapPin } from 'lucide-react';
import { AreaGallerySection } from '@/components/areas/AreaGallerySection';
import { BuildingGalleryInfo } from '@/components/buildings/BuildingGalleryInfo';
import { BuildingLocationInfo } from '@/components/buildings/BuildingLocationInfo';
import { BuildingMetricCard } from '@/components/buildings/BuildingMetricCard';
import { BuildingRangeTable } from '@/components/buildings/BuildingRangeTable';
import { BuildingReportLeadForm } from '@/components/leads/BuildingReportLeadForm';
import PageLayout from '@/components/layout/PageLayout';
import { AnimateSection } from '@/components/shared/AnimateSection';
import { PageBanner } from '@/components/shared/PageBanner';
import { PublicBreadCrumb } from '@/components/shared/PublicBreadCrumb';
import { SectionCard } from '@/components/shared/SectionCard';
import { AnimatedCounter } from '@/components/shared/AnimatedCounter';
import { AmenityPills } from '@/components/shared/AmenityPills';
import { ReadOnlyMap } from '@/components/shared/location/ReadOnlyMap';
import { getBuildingBySlug } from '@/lib/db/buildings/queries';

type BuildingDetailPageProps = {
  params: Promise<{
    city: string;
    area: string;
    building: string;
  }>;
};

export async function generateMetadata({ params }: BuildingDetailPageProps): Promise<Metadata> {
  const { city, area, building } = await params;
  const response = await getBuildingBySlug(city, area, building);

  if (!response.success || !response.data) return {};

  const buildingDetail = response.data;
  const seo = buildingDetail.buildings_seo;
  const title = seo?.meta_title || `${buildingDetail.name}, ${buildingDetail.area?.name ?? 'UAE'} Building Report`;
  const description = seo?.meta_description || buildingDetail.description || `Review ${buildingDetail.name} pricing, yields, amenities, and investment context.`;
  const image = buildingDetail.photos?.[0];
  const imageUrl = seo?.og_image_url || image?.url;
  const canonical = seo?.canonical_url || `/areas/${city}/${area}/${building}`;
  const keywords = seo?.keywords
    ?.split(',')
    .map((keyword) => keyword.trim())
    .filter(Boolean);

  return {
    title,
    description,
    keywords: keywords?.length ? keywords : undefined,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      images: imageUrl ? [{ url: imageUrl, alt: image?.alt_tag || buildingDetail.name }] : undefined,
      type: 'website',
    },
    twitter: {
      card: imageUrl ? 'summary_large_image' : 'summary',
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function BuildingDetailPage({ params }: BuildingDetailPageProps) {
  const { city, area, building } = await params;
  const response = await getBuildingBySlug(city, area, building);

  if (!response.success || !response.data) {
    notFound();
  }

  const buildingDetail = response.data;
  const galleryPhotos = Array.isArray(buildingDetail.photos) ? buildingDetail.photos : [];
  const bannerImage = galleryPhotos[0];
  const buildingAmenityPills =
    buildingDetail.amenity_details ??
    buildingDetail.amenities.map((amenity) => ({
      id: amenity,
      name: amenity,
      logo_url: null,
    }));
  const locationLine = [buildingDetail.area?.name, buildingDetail.city?.name, buildingDetail.developer?.name].filter(Boolean).join(' • ');

  return (
    <PageLayout contentFullWidth wrapperClassName="py-0">
      {/* Breadcrumb navigation stays outside the visual hero for cleaner banner composition. */}
      <div className="container mx-auto px-4 py-2 sm:px-6 lg:px-8">
        <PublicBreadCrumb />
      </div>

      {/* Hero section presents the building identity and amenity pills in a full-screen banner. */}
      <PageBanner
        imageUrl={bannerImage?.url}
        alt={bannerImage?.alt_tag || buildingDetail.name}
        className="flex-col"
        heightClassName="min-h-0 pt-[76px] pb-10 md:min-h-[76vh] md:pt-[92px] md:pb-[96px]"
        imageClassName="animate-hero-kenburns motion-reduce:animate-none"
        overlayClassName="bg-[linear-gradient(90deg,oklch(0.15_0.035_260.47_/_0.88),oklch(0.18_0.03_263.61_/_0.58),oklch(0.18_0.03_263.61_/_0.18))]"
        contentClassName="container mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-4xl space-y-5 text-white">
          <div className="space-y-4">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary-foreground/72">Building intelligence report</p>
            <h1 className="max-w-4xl text-5xl font-extrabold leading-[1.04] sm:text-6xl lg:text-7xl">{buildingDetail.name}</h1>
            {locationLine && <p className="text-sm font-bold leading-6 text-primary-foreground/78 sm:text-base">{locationLine}</p>}
            {buildingDetail.description && <p className="max-w-2xl text-base font-medium leading-7 text-white/84 sm:text-lg">{buildingDetail.description}</p>}
          </div>
          {buildingAmenityPills.length > 0 && (
            <div className="max-w-3xl">
              <AmenityPills amenities={buildingAmenityPills.slice(0, 8)} compact />
            </div>
          )}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <a
              href="#report"
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary-foreground px-4 text-sm font-extrabold text-[oklch(0.18_0.04_260.47)] shadow-sm transition-colors hover:bg-primary-foreground/90"
            >
              <Download className="size-4" />
              Download report
            </a>
          </div>
        </div>
      </PageBanner>

      {/* Overview section surfaces the core decision metrics for quick investor comparison. */}
      <AnimateSection id="overview">
        <SectionCard
          eyebrow="Building overview"
          title="Decision signals"
          description={`Key facts for ${buildingDetail.name}, connected to ${buildingDetail.area?.name ?? 'this area'}.`}
          align="center"
          className="bg-[oklch(0.965_0.012_260.47)]"
          classes={{
            wrapper: 'mb-[clamp(1.8rem,4vw,3rem)] gap-4 md:gap-8',
            eyebrow: 'text-xs font-extrabold tracking-[0.15em]',
            title: 'text-[clamp(1.75rem,3.2vw,2.75rem)] leading-tight',
            description: 'mx-auto max-w-[620px] font-medium',
          }}
        >
          <div className="space-y-5">
            <BuildingMetricCard
              items={[
                {
                  label: 'Avg price / sqft',
                  value: typeof buildingDetail.avg_price_per_sqft === 'number' ? <AnimatedCounter prefix="AED" value={buildingDetail.avg_price_per_sqft} /> : 'Not available',
                  badge: 'AED',
                  tone: 'positive',
                },
                {
                  label: 'Rental yield',
                  value: typeof buildingDetail.rental_yield === 'number' ? <AnimatedCounter value={buildingDetail.rental_yield} suffix="%" maximumFractionDigits={1} /> : 'Not available',
                  badge: 'Yield',
                  tone: 'warning',
                },
                {
                  label: 'Total units',
                  value: typeof buildingDetail.total_units === 'number' ? <AnimatedCounter value={buildingDetail.total_units} /> : 'Not available',
                  badge: 'Units',
                  tone: 'neutral',
                },
                {
                  label: 'Completion',
                  value: typeof buildingDetail.completion_year === 'number' ? <AnimatedCounter value={buildingDetail.completion_year} /> : 'Not available',
                  badge: 'Year',
                  tone: 'neutral',
                },
              ]}
            />
            <BuildingMetricCard
              items={[
                { label: 'Building type', value: buildingDetail.building_type || 'Not available' },
                {
                  label: 'Floors',
                  value: typeof buildingDetail.total_floors === 'number' ? <AnimatedCounter value={buildingDetail.total_floors} suffix="floors" /> : 'Not available',
                },
                {
                  label: 'Service charge',
                  value:
                    typeof buildingDetail.service_charge_aed_per_sqft === 'number' ? (
                      <AnimatedCounter prefix="AED" value={buildingDetail.service_charge_aed_per_sqft} suffix="/ sqft" maximumFractionDigits={2} />
                    ) : (
                      'Not available'
                    ),
                  badge: 'AED',
                  tone: 'positive',
                },
                { label: 'Demand', value: buildingDetail.demand_level || 'Not available', badge: buildingDetail.demand_level || undefined, tone: 'positive' },
              ]}
            />
          </div>
        </SectionCard>
      </AnimateSection>

      {/* Report CTA section captures lead details before downloading the PDF report. */}
      <AnimateSection id="report">
        <SectionCard className="bg-[oklch(0.935_0.018_260.47)]">
          <div className="grid overflow-hidden rounded-[22px] border border-border bg-card shadow-sm lg:grid-cols-[1.05fr_0.95fr]">
            <div className="relative min-h-[300px] overflow-hidden bg-muted sm:min-h-[380px] lg:min-h-[520px]">
              {bannerImage?.url ? (
                <Image src={bannerImage.url} alt={bannerImage.alt_tag || buildingDetail.name} fill className="object-cover" sizes="(min-width: 1024px) 50vw, 92vw" />
              ) : (
                <div className="flex h-full min-h-[300px] items-center justify-center bg-[oklch(0.24_0.035_260.47)] text-primary-foreground sm:min-h-[380px] lg:min-h-[520px]">
                  <Building2 className="size-16 opacity-80" />
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[oklch(0.16_0.03_260.47/0.76)] to-transparent p-5 text-primary-foreground">
                <p className="text-sm font-bold">{buildingDetail.name}</p>
                <p className="mt-1 text-xs font-medium text-primary-foreground/78">{buildingDetail.area?.name ?? 'Building intelligence report'}</p>
              </div>
            </div>

            <div className="flex flex-col justify-center px-5 py-8 sm:px-8 lg:px-10">
              <div className="mx-auto mb-7 max-w-[620px] text-center">
                <span className="text-xs font-extrabold uppercase tracking-[0.15em] text-primary">Full PDF report</span>
                <h2 className="mt-3 text-[clamp(1.45rem,2.4vw,2.1rem)] font-extrabold leading-tight text-foreground">{buildingDetail.name} building report</h2>
                <p className="mx-auto mt-3 max-w-[560px] text-base font-medium leading-7 text-muted-foreground">Enter your email to generate report download the pdf.</p>
              </div>
              <BuildingReportLeadForm buildingName={buildingDetail.name} citySlug={city} areaSlug={area} buildingSlug={building} />
            </div>
          </div>
        </SectionCard>
      </AnimateSection>

      {/* Gallery section displays building photos only when uploaded gallery data exists. */}
      {galleryPhotos.length > 0 && (
        <AnimateSection id="gallery">
          <SectionCard
            eyebrow="Building gallery"
            title="Gallery"
            className="bg-[oklch(0.935_0.018_260.47)]"
            classes={{
              wrapper: 'mb-[clamp(1.8rem,4vw,3rem)] gap-4 md:gap-8',
              eyebrow: 'text-xs font-extrabold tracking-[0.15em] before:w-[22px]',
              title: 'text-[clamp(1.75rem,3.2vw,2.75rem)] leading-tight',
            }}
          >
            <div className="grid overflow-hidden rounded-[22px] border border-border bg-card shadow-[0_18px_42px_oklch(0.2_0.03_263.61/0.10)] lg:grid-cols-[0.82fr_1.18fr]">
              <BuildingGalleryInfo building={buildingDetail} photoCount={galleryPhotos.length} />
              <div className="p-3 sm:p-4">
                <AreaGallerySection
                  eyebrow="Building Gallery"
                  typewriterText={`A closer look at ${buildingDetail.name}`}
                  description="Review building views, amenities, and context before comparing pricing or rental assumptions."
                  imageAltPrefix={buildingDetail.name}
                  photos={galleryPhotos}
                  showIntro={false}
                />
              </div>
            </div>
          </SectionCard>
        </AnimateSection>
      )}

      {/* Ranges section compares sale and rental price bands by unit type. */}
      {(buildingDetail.unit_price_ranges.length > 0 || buildingDetail.rental_ranges.length > 0) && (
        <AnimateSection id="ranges">
          <SectionCard
            eyebrow="Price intelligence"
            title="Unit ranges"
            description="Indicative sale and rental ranges by unit type."
            className="bg-[oklch(0.965_0.012_260.47)]"
            classes={{
              wrapper: 'mb-[clamp(1.8rem,4vw,3rem)] gap-4 md:gap-8',
              eyebrow: 'text-xs font-extrabold tracking-[0.15em] before:w-[22px]',
              title: 'text-[clamp(1.75rem,3.2vw,2.75rem)] leading-tight',
              description: 'font-medium',
            }}
          >
            <div className="grid gap-5 xl:grid-cols-2">
              <BuildingRangeTable title="Sale price ranges" ranges={buildingDetail.unit_price_ranges} />
              <BuildingRangeTable title="Rental ranges" ranges={buildingDetail.rental_ranges} />
            </div>
          </SectionCard>
        </AnimateSection>
      )}

      {/* Nearby places section shows surrounding landmarks without repeating banner amenities. */}
      {buildingDetail.nearby_places.length > 0 && (
        <AnimateSection id="lifestyle">
          <SectionCard
            eyebrow="Lifestyle context"
            title="Nearby places"
            className="bg-[oklch(0.935_0.018_260.47)]"
            classes={{
              wrapper: 'mb-[clamp(1.8rem,4vw,3rem)] gap-4 md:gap-8',
              eyebrow: 'text-xs font-extrabold tracking-[0.15em] before:w-[22px]',
              title: 'text-[clamp(1.75rem,3.2vw,2.75rem)] leading-tight',
            }}
          >
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="space-y-3">
                {buildingDetail.nearby_places.map((place) => (
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
          </SectionCard>
        </AnimateSection>
      )}

      {/* Tradeoff section lists pros and cons for investor review. */}
      {(buildingDetail.pros.length > 0 || buildingDetail.cons.length > 0) && (
        <AnimateSection id="tradeoffs">
          <SectionCard
            eyebrow="Investor notes"
            title="Pros and cons"
            className="bg-[oklch(0.965_0.012_260.47)]"
            classes={{
              wrapper: 'mb-[clamp(1.8rem,4vw,3rem)] gap-4 md:gap-8',
              eyebrow: 'text-xs font-extrabold tracking-[0.15em] before:w-[22px]',
              title: 'text-[clamp(1.75rem,3.2vw,2.75rem)] leading-tight',
            }}
          >
            <div className="grid gap-5 lg:grid-cols-2">
              {buildingDetail.pros.length > 0 && (
                <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                  <h3 className="mb-4 flex items-center gap-2 text-base font-extrabold text-foreground">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    Pros
                  </h3>
                  <ul className="space-y-3">
                    {buildingDetail.pros.map((item) => (
                      <li key={item} className="text-sm font-medium leading-6 text-muted-foreground">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {buildingDetail.cons.length > 0 && (
                <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                  <h3 className="mb-4 flex items-center gap-2 text-base font-extrabold text-foreground">
                    <AlertCircle className="h-5 w-5 text-muted-foreground" />
                    Cons
                  </h3>
                  <ul className="space-y-3">
                    {buildingDetail.cons.map((item) => (
                      <li key={item} className="text-sm font-medium leading-6 text-muted-foreground">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </SectionCard>
        </AnimateSection>
      )}

      {/* Location section renders the read-only map when coordinates are available. */}
      {buildingDetail.location && (
        <AnimateSection id="location">
          <SectionCard
            eyebrow="Location"
            title="Map"
            className="bg-[oklch(0.935_0.018_260.47)]"
            classes={{
              wrapper: 'mb-[clamp(1.8rem,4vw,3rem)] gap-4 md:gap-8',
              eyebrow: 'text-xs font-extrabold tracking-[0.15em] before:w-[22px]',
              title: 'text-[clamp(1.75rem,3.2vw,2.75rem)] leading-tight',
            }}
          >
            <div className="grid overflow-hidden rounded-[22px] border border-border bg-card shadow-[0_18px_42px_oklch(0.2_0.03_263.61/0.10)] lg:grid-cols-[0.72fr_1.28fr]">
              <BuildingLocationInfo building={buildingDetail} />
              <div className="min-h-[360px] bg-muted lg:min-h-[520px]">
                <ReadOnlyMap center={buildingDetail.location} zoom={15} />
              </div>
            </div>
          </SectionCard>
        </AnimateSection>
      )}
    </PageLayout>
  );
}
