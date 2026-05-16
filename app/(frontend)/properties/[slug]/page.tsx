import { getPropertyBySlug } from '@/lib/db/properties/queries';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import PageLayout from '@/components/layout/PageLayout';
import { PublicBreadCrumb } from '@/components/shared/PublicBreadCrumb';
import { ReadOnlyMap } from '@/components/shared/location/ReadOnlyMap';
import PropertyContentCard from '@/components/properties/card/PropertyContentCard';
import PropertyAmenities from '@/components/properties/tabs/Amenities';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import PropertyAttributes from '@/components/properties/tabs/KeyInformation';
import { PropertyDescription } from '@/components/properties/tabs/PropertyDescription';
import { DeveloperInfo } from '@/components/properties/tabs/DeveloperInfo';
import { PropertyQuickNav } from '@/components/properties/PropertyQuickNav';
import { PropertyGallery } from '@/components/properties/tabs/PropertyGallery';
import type { ImageObject } from '@/types/images';
import { PropertyInfo } from '@/components/properties/tabs/PropertyInfo';
import SideBarContent from '@/components/properties/tabs/SideBarContent';
import { PropertyContentLayout } from '@/components/properties/layout/PropertyContent';

interface PropertyPageProps {
  params: Promise<{ slug: string }>;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  available: { label: 'Available', className: 'bg-primary/95 text-primary-foreground backdrop-blur-sm' },
  sold: { label: 'Sold', className: 'bg-muted/90 text-muted-foreground backdrop-blur-sm' },
  reserved: { label: 'Reserved', className: 'bg-accent/90 text-accent-foreground backdrop-blur-sm' },
  off_plan: { label: 'Off Plan', className: 'bg-secondary/90 text-secondary-foreground backdrop-blur-sm' },
};

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const response = await getPropertyBySlug(slug);

  if (!response.success || !response.data) {
    return {
      title: 'Property Not Found',
    };
  }

  const property = response.data;
  const photos = property.photos as { url?: string }[] | undefined;
  const firstImage = photos?.[0]?.url;

  return {
    title: `${property.title} | DubaiPropertyIQ`,
    description: property.description,
    openGraph: {
      title: property.title,
      description: property.description,
      images: firstImage ? [{ url: firstImage }] : undefined,
      type: 'website',
    },
  };
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { slug } = await params;
  const response = await getPropertyBySlug(slug);

  // Trigger 404 if property not found
  if (!response.success || !response.data) {
    notFound();
  }

  const property = response.data;
  const photos = property.photos as ImageObject[];

  const status = statusConfig[property.status] || {
    label: property.status,
    className: 'bg-muted/90 text-muted-foreground backdrop-blur-sm',
  };

  return (
    <PageLayout className="py-2 space-y-4 px-4" breadcrumb={<PublicBreadCrumb />}>
      <PropertyQuickNav />

      {/* ── Gallery Section ── */}
      <PropertyGallery photos={photos} title={property.title} statusLabel={status.label} statusClassName={status.className} />

      <PropertyContentLayout SidebarContent={<SideBarContent property={property} />}>
        {/* Title & Price & Description */}
        <PropertyInfo id="overview" property={property}>
          <PropertyDescription description={property.description} />
        </PropertyInfo>

        {/* ── Developer Section ── */}
        {property.developer && (
          <PropertyContentCard id="developer" title="Developer">
            <DeveloperInfo developer={property.developer} />
          </PropertyContentCard>
        )}

        {/* ── Key Information Section ── */}
        <PropertyContentCard id="key-info" title="Key Information" className="gap-2">
          <PropertyAttributes {...property} />
        </PropertyContentCard>

        {/* ── Location Section ── */}
        {property.location && (
          <PropertyContentCard id="location" title="Location" className="gap-2">
            <ReadOnlyMap center={property.location} />
          </PropertyContentCard>
        )}

        {/* ── Amenities Section ── */}
        {property.amenities?.length ? (
          <PropertyContentCard id="amenities" title="Amenities" className="gap-2">
            <PropertyAmenities amenities={property.amenities} />
          </PropertyContentCard>
        ) : null}

        {/* ── FAQ Section ── */}
        {property.properties_faqs?.length ? (
          <PropertyContentCard id="faq" title="Frequently Asked Questions" className="gap-2">
            <FAQAccordion faqs={property.properties_faqs} />
          </PropertyContentCard>
        ) : null}
      </PropertyContentLayout>
    </PageLayout>
  );
}
