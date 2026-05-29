import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Building2, MapPin, ShieldCheck } from 'lucide-react';
import { AreaAmenitiesPills } from '@/components/areas/AreaAmenitiesPills';
import { AreaGallerySection } from '@/components/areas/AreaGallerySection';
import { AreaQuickNav } from '@/components/areas/AreaQuickNav';
import PageLayout from '@/components/layout/PageLayout';
import PropertyContentCard from '@/components/properties/card/PropertyContentCard';
import { PropertyCardHomeSlide } from '@/components/properties/card';
import { SliderSection } from '@/components/sliders/SliderSection';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { PageBanner } from '@/components/shared/PageBanner';
import { PublicBreadCrumb } from '@/components/shared/PublicBreadCrumb';
import { SectionCard } from '@/components/shared/SectionCard';
import { AnimateSection } from '@/components/shared/AnimateSection';
import { ReadOnlyMap } from '@/components/shared/location/ReadOnlyMap';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { getAreaBySlug } from '@/lib/db/areas/queries';

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
              <AreaAmenitiesPills amenities={areaDetail.amenities} />
            </div>
          )}
        </div>
      </PageBanner>

      {/* ── Quick Navigation Section ── */}
      <AreaQuickNav />

      {/* ── General Information Section ── */}
      <AnimateSection>
        <SectionCard>
          <PropertyContentCard id="general-information" title="General Information">
            <div className="space-y-6">
              <p className="max-w-3xl text-base leading-8 text-muted-foreground">
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
          </PropertyContentCard>
        </SectionCard>
      </AnimateSection>

      <Separator />

      {/* ── Gallery Section ── */}
      {galleryPhotos.length > 0 && (
        <AnimateSection id="gallery">
          <SectionCard>
            <AreaGallerySection
              eyebrow="Community Gallery"
              typewriterText={`A closer look at life in ${areaDetail.name}`}
              description="Browse selected views, streetscapes, and community details that help you read the area before comparing properties."
              imageAltPrefix={areaDetail.name}
              photos={galleryPhotos}
            />
          </SectionCard>
        </AnimateSection>
      )}

      {galleryPhotos.length > 0 && <Separator />}

      {/* ── Location Section ── */}
      {areaDetail.location && (
        <AnimateSection>
          <SectionCard>
            <PropertyContentCard id="location" title="Location" className="gap-2">
              <div className="overflow-hidden rounded-lg border bg-muted">
                <ReadOnlyMap center={areaDetail.location} />
              </div>
            </PropertyContentCard>
          </SectionCard>
        </AnimateSection>
      )}

      {areaDetail.location && <Separator />}

      {/* ── Properties Section ── */}
      {areaDetail.properties.length > 0 && (
        <AnimateSection>
          <SliderSection
            title={`Properties in ${areaDetail.name}`}
            description={`Browse available properties linked to ${areaDetail.name}.`}
            data={areaDetail.properties}
            SlideComponent={PropertyCardHomeSlide}
            delay={4000}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 1, spaceBetween: 20 },
              768: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 4, spaceBetween: 20 },
            }}
            classes={{
              title: 'font-bold',
            }}
          />
        </AnimateSection>
      )}

      {areaDetail.properties.length > 0 && <Separator />}

      {/* ── Area FAQs Section ── */}
      {areaDetail.faqs.length > 0 && (
        <AnimateSection>
          <SectionCard>
            <PropertyContentCard id="area-faqs" title="Area FAQs" className="gap-2">
              <FAQAccordion faqs={areaDetail.faqs} type="multiple" />
            </PropertyContentCard>
          </SectionCard>
        </AnimateSection>
      )}

      {areaDetail.faqs.length > 0 && areaDetail.amenities_faqs.length > 0 && <Separator />}

      {/* ── Amenities FAQs Section ── */}
      {areaDetail.amenities_faqs.length > 0 && (
        <AnimateSection>
          <SectionCard>
            <PropertyContentCard id="amenities-faqs" title="Amenities FAQs" className="gap-2">
              <FAQAccordion faqs={areaDetail.amenities_faqs} type="multiple" />
            </PropertyContentCard>
          </SectionCard>
        </AnimateSection>
      )}
    </PageLayout>
  );
}
