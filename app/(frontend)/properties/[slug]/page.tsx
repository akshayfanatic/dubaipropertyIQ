import { getPropertyBySlug } from '@/lib/db/properties/queries';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import PageLayout from '@/components/layout/PageLayout';
import { PublicBreadCrumb } from '@/components/shared/PublicBreadCrumb';
import { ReadOnlyMap } from '@/components/shared/location/ReadOnlyMap';
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
import { getPropertyStatusBadgeConfig } from '@/config';
import { SectionCard } from '@/components/shared/SectionCard';
import { createPropertyMetadata } from '@/lib/utils/seo';
import { LeadCaptureForm } from '@/components/leads/LeadCaptureForm';

interface PropertyPageProps {
  params: Promise<{ slug: string }>;
}

const propertySectionClasses = {
  wrapper: 'mb-9 gap-4',
  eyebrow: 'text-xs font-extrabold tracking-[0.15em] before:w-[22px]',
  title: 'text-[clamp(1.35rem,2.4vw,1.9rem)] leading-tight',
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

  return createPropertyMetadata(response.data);
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

  const status = getPropertyStatusBadgeConfig(property.status);

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
          <SectionCard id="developer" eyebrow="Developer" title="Developer" className="py-0" containerClassName="w-full" classes={propertySectionClasses}>
            <DeveloperInfo developer={property.developer} />
          </SectionCard>
        )}

        {/* ── Key Information Section ── */}
        <SectionCard id="key-info" eyebrow="Key facts" title="Key Information" className="py-0" containerClassName="w-full" classes={propertySectionClasses}>
          <PropertyAttributes {...property} />
        </SectionCard>

        {/* ── Location Section ── */}
        {property.location && (
          <SectionCard id="location" eyebrow="Location" title="Location" className="py-0" containerClassName="w-full" classes={propertySectionClasses}>
            <ReadOnlyMap center={property.location} />
          </SectionCard>
        )}

        {/* ── Amenities Section ── */}
        {property.amenities?.length ? (
          <SectionCard id="amenities" eyebrow="Amenities" title="Amenities" className="py-0" containerClassName="w-full" classes={propertySectionClasses}>
            <PropertyAmenities amenities={property.amenities} />
          </SectionCard>
        ) : null}

        {/* ── FAQ Section ── */}
        {property.properties_faqs?.length ? (
          <SectionCard id="faq" eyebrow="FAQ" title="Frequently Asked Questions" className="py-0" containerClassName="w-full" classes={propertySectionClasses}>
            <FAQAccordion faqs={property.properties_faqs} />
          </SectionCard>
        ) : null}

        {/* ── Lead Capture Section ── */}
        <SectionCard
          id="inquiry"
          eyebrow="Inquiry"
          title="Request Property Details"
          description="Tell us your budget and timeline. Our team will follow up with availability, viewing options, or similar matches."
          className="py-0"
          containerClassName="w-full"
          contentClassName="rounded-[18px] border border-border bg-card p-[clamp(1.25rem,3vw,2rem)] shadow-[0_14px_34px_oklch(0.2_0.03_263.61_/_0.10)]"
          classes={propertySectionClasses}
        >
          <LeadCaptureForm sourceType="property" areaOfInterest={property.title} showPhone requirePhone showBudget requireBudget showTimeline requireTimeline showMessage idPrefix="property-inquiry" />
        </SectionCard>
      </PropertyContentLayout>
    </PageLayout>
  );
}
