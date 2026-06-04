import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Building2, MapPin, ShieldCheck } from 'lucide-react';
import { AreaGallerySection } from '@/components/areas/AreaGallerySection';
import { AreaQuickNav } from '@/components/areas/AreaQuickNav';
import PageLayout from '@/components/layout/PageLayout';
import { PropertyCardSlide } from '@/components/properties/card';
import { SliderSection } from '@/components/sliders/SliderSection';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { PageBanner } from '@/components/shared/PageBanner';
import { PublicBreadCrumb } from '@/components/shared/PublicBreadCrumb';
import { SectionCard } from '@/components/shared/SectionCard';
import { AnimateSection } from '@/components/shared/AnimateSection';
import { AmenityPills } from '@/components/shared/AmenityPills';
import { ReadOnlyMap } from '@/components/shared/location/ReadOnlyMap';
import { Badge } from '@/components/ui/badge';
import { getAreaBySlug } from '@/lib/db/areas/queries';
import { AreaReportLeadForm } from '@/components/leads/AreaReportLeadForm';

type AreaDetailPageProps = {
  params: Promise<{
    city: string;
    area: string;
  }>;
};

export async function generateMetadata({ params }: AreaDetailPageProps): Promise<Metadata> {
  const { city, area } = await params;
  const response = await getAreaBySlug(area);

  if (!response.success || !response.data || response.data.city?.slug !== city) {
    return {};
  }

  const areaDetail = response.data;
  const title = `${areaDetail.name}, ${areaDetail.city?.name ?? 'UAE'} Properties`;
  const description = areaDetail.description || `Explore ${areaDetail.name} area information, amenities, FAQs, and available properties.`;
  const image = Array.isArray(areaDetail.photos) && areaDetail.photos.length > 0 ? areaDetail.photos[0] : null;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image ? [{ url: image.url, alt: image.alt_tag || `${areaDetail.name} community photo` }] : undefined,
    },
  };
}

export default async function AreaDetailPage({ params }: AreaDetailPageProps) {
  const { city, area } = await params;
  const response = await getAreaBySlug(area);

  if (!response.success || !response.data || response.data.city?.slug !== city) {
    notFound();
  }

  const areaDetail = response.data;
  const galleryPhotos = Array.isArray(areaDetail.photos) ? areaDetail.photos : [];
  const bannerImage = galleryPhotos[0];

  return (
    <PageLayout contentFullWidth wrapperClassName="py-0">
      {/* ── Breadcrumb Section ── */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <PublicBreadCrumb />
      </div>

      {/* ── Hero Banner Section ── */}
      <PageBanner
        imageUrl={bannerImage?.url}
        alt={bannerImage?.alt_tag || `${areaDetail.name} community photo`}
        heightClassName="min-h-[360px] sm:min-h-[560px]"
        overlayClassName="bg-black/50"
        contentClassName="container mx-auto flex min-h-[360px] flex-col justify-center px-4 sm:min-h-[560px] sm:px-6 lg:px-8"
      >
        <div className="max-w-3xl space-y-4 text-white">
          <Badge className="border-white/25 bg-white/15 text-white backdrop-blur-sm">
            <MapPin className="h-3.5 w-3.5" />
            {areaDetail.city?.name ?? 'UAE'} Community
          </Badge>
          <div className="space-y-3">
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">{areaDetail.name}</h1>
          </div>
          {areaDetail.amenities.length > 0 && (
            <div id="amenities">
              <AmenityPills amenities={areaDetail.amenities} />
            </div>
          )}
        </div>
      </PageBanner>

      {/* ── Quick Navigation Section ── */}
      <AreaQuickNav />

      {/* ── General Information Section ── */}
      <AnimateSection id="general-information">
        <SectionCard
          eyebrow="General information"
          title="Overview"
          className="bg-[oklch(0.965_0.012_260.47)] py-[clamp(3.6rem,7vw,6.5rem)]"
          classes={{
            wrapper: 'mb-[clamp(1.8rem,4vw,3rem)] gap-4 md:gap-8',
            eyebrow: 'text-xs font-extrabold tracking-[0.15em] before:w-[22px]',
            title: 'text-[clamp(1.9rem,3.8vw,3.15rem)] leading-tight',
          }}
        >
          <div className="rounded-[18px] border border-border bg-card p-[clamp(1.35rem,3vw,2.2rem)] shadow-[0_14px_34px_oklch(0.2_0.03_263.61_/_0.10)]">
            <div className="space-y-6">
              <p className="max-w-4xl text-base font-medium leading-8 text-muted-foreground">
                {areaDetail.description || `${areaDetail.name} is a community in ${areaDetail.city?.name ?? 'the UAE'} with curated local information and available property listings.`}
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="gap-1.5 px-3 py-1.5">
                  <Building2 className="h-3.5 w-3.5" />
                  {areaDetail.properties.length} Available Properties
                </Badge>
                <Badge variant="outline" className="gap-1.5 px-3 py-1.5">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {areaDetail.amenities.length} Amenities
                </Badge>
              </div>
            </div>
          </div>
        </SectionCard>
      </AnimateSection>

      <AnimateSection id="area-report">
        <SectionCard
          eyebrow="Area report"
          title={`Download the ${areaDetail.name} area report`}
          description="Get a focused community snapshot before comparing listings."
          className="bg-[oklch(0.935_0.018_260.47)] py-[clamp(3.6rem,7vw,6.5rem)]"
          classes={{
            wrapper: 'mb-[clamp(1.8rem,4vw,3rem)] gap-4 md:gap-8',
            eyebrow: 'text-xs font-extrabold tracking-[0.15em] before:w-[22px]',
            title: 'text-[clamp(1.9rem,3.8vw,3.15rem)] leading-tight',
            description: 'max-w-[560px] font-medium',
          }}
        >
          <div className="rounded-[18px] border border-border bg-card p-[clamp(1.35rem,3vw,2.2rem)] shadow-[0_14px_34px_oklch(0.2_0.03_263.61_/_0.10)]">
            <AreaReportLeadForm areaName={areaDetail.name} />
          </div>
        </SectionCard>
      </AnimateSection>

      {/* ── Gallery Section ── */}
      {galleryPhotos.length > 0 && (
        <AnimateSection id="gallery">
          <SectionCard
            eyebrow="Community gallery"
            title="Gallery"
            className="bg-[oklch(0.935_0.018_260.47)] py-[clamp(3.6rem,7vw,6.5rem)]"
            classes={{
              wrapper: 'mb-[clamp(1.8rem,4vw,3rem)] gap-4 md:gap-8',
              eyebrow: 'text-xs font-extrabold tracking-[0.15em] before:w-[22px]',
              title: 'text-[clamp(1.9rem,3.8vw,3.15rem)] leading-tight',
            }}
          >
            <AreaGallerySection
              eyebrow="Community Gallery"
              typewriterText={`A closer look at life in ${areaDetail.name}`}
              description="Browse selected views, streetscapes, and community details that help you read the area before comparing properties."
              imageAltPrefix={areaDetail.name}
              photos={galleryPhotos}
              showIntro={false}
            />
          </SectionCard>
        </AnimateSection>
      )}

      {/* ── Location Section ── */}
      {areaDetail.location && (
        <AnimateSection id="location">
          <SectionCard
            eyebrow="Location"
            title="Location"
            className="bg-[oklch(0.965_0.012_260.47)] py-[clamp(3.6rem,7vw,6.5rem)]"
            classes={{
              wrapper: 'mb-[clamp(1.8rem,4vw,3rem)] gap-4 md:gap-8',
              eyebrow: 'text-xs font-extrabold tracking-[0.15em] before:w-[22px]',
              title: 'text-[clamp(1.9rem,3.8vw,3.15rem)] leading-tight',
            }}
          >
            <div className="overflow-hidden rounded-[18px] border border-border bg-muted shadow-[0_14px_34px_oklch(0.2_0.03_263.61_/_0.10)]">
              <ReadOnlyMap center={areaDetail.location} />
            </div>
          </SectionCard>
        </AnimateSection>
      )}

      {/* ── Properties Section ── */}
      {areaDetail.properties.length > 0 && (
        <AnimateSection id="properties">
          <SliderSection
            eyebrow="Available properties"
            title="Properties"
            description={`Available listings in ${areaDetail.name}.`}
            align="center"
            showNavigation={false}
            data={areaDetail.properties}
            SlideComponent={PropertyCardSlide}
            delay={4000}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 1, spaceBetween: 20 },
              768: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 4, spaceBetween: 20 },
            }}
            className="bg-[oklch(0.935_0.018_260.47)] py-[clamp(3.6rem,7vw,6.5rem)]"
            classes={{
              wrapper: 'mb-[clamp(1.8rem,4vw,3rem)] gap-4 md:gap-8',
              eyebrow: 'text-xs font-extrabold tracking-[0.15em] before:w-[22px]',
              title: 'text-[clamp(1.9rem,3.8vw,3.15rem)] font-extrabold leading-tight',
              description: 'mx-auto max-w-[470px] font-medium',
            }}
          />
        </AnimateSection>
      )}

      {/* ── Area FAQs Section ── */}
      {areaDetail.faqs.length > 0 && (
        <AnimateSection id="area-faqs">
          <SectionCard
            eyebrow="Area FAQs"
            title="Area FAQ"
            className="bg-[oklch(0.965_0.012_260.47)] py-[clamp(3.6rem,7vw,6.5rem)]"
            classes={{
              wrapper: 'mb-[clamp(1.8rem,4vw,3rem)] gap-4 md:gap-8',
              eyebrow: 'text-xs font-extrabold tracking-[0.15em] before:w-[22px]',
              title: 'text-[clamp(1.9rem,3.8vw,3.15rem)] leading-tight',
            }}
          >
            <FAQAccordion faqs={areaDetail.faqs} type="multiple" />
          </SectionCard>
        </AnimateSection>
      )}

      {/* ── Amenities FAQs Section ── */}
      {areaDetail.amenities_faqs.length > 0 && (
        <AnimateSection id="amenities-faqs">
          <SectionCard
            eyebrow="Amenities FAQs"
            title="Amenity FAQ"
            className="bg-[oklch(0.935_0.018_260.47)] py-[clamp(3.6rem,7vw,6.5rem)]"
            classes={{
              wrapper: 'mb-[clamp(1.8rem,4vw,3rem)] gap-4 md:gap-8',
              eyebrow: 'text-xs font-extrabold tracking-[0.15em] before:w-[22px]',
              title: 'text-[clamp(1.9rem,3.8vw,3.15rem)] leading-tight',
            }}
          >
            <FAQAccordion faqs={areaDetail.amenities_faqs} type="multiple" />
          </SectionCard>
        </AnimateSection>
      )}
    </PageLayout>
  );
}
