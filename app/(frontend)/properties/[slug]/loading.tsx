import PageLayout from '@/components/layout/PageLayout';
import {
  PropertyGallerySkeleton,
  SideBarContentSkeleton,
  PropertyInfoSkeleton,
  PropertyAttributesSkeleton,
  PropertyAmenitiesSkeleton,
  DeveloperInfoSkeleton,
} from '@/components/properties/PropertySkeletons';
import { PropertyContentLayout } from '@/components/properties/layout/PropertyContent';
import { SectionCard } from '@/components/shared/SectionCard';
import { Skeleton } from '@/components/ui/skeleton';

const propertySectionClasses = {
  wrapper: 'mb-9 gap-4',
  eyebrow: 'text-xs font-extrabold tracking-[0.15em] before:w-[22px]',
  title: 'text-[clamp(1.35rem,2.4vw,1.9rem)] leading-tight',
};

export default function Loading() {
  return (
    <PageLayout className="py-2 space-y-4 px-4" breadcrumb={<Skeleton className="h-6 w-64 mb-4" />}>
      {/* ── Gallery Section Skeleton ── */}
      <PropertyGallerySkeleton />

      <PropertyContentLayout SidebarContent={<SideBarContentSkeleton />}>
        {/* Title & Price & Description Skeleton */}
        <PropertyInfoSkeleton />

        {/* ── Developer Section Skeleton ── */}
        <SectionCard eyebrow="Developer" title="Developer" className="py-0" containerClassName="w-full" classes={propertySectionClasses}>
          <DeveloperInfoSkeleton />
        </SectionCard>

        {/* ── Key Information Section Skeleton ── */}
        <SectionCard eyebrow="Key facts" title="Key Information" className="py-0" containerClassName="w-full" classes={propertySectionClasses}>
          <PropertyAttributesSkeleton />
        </SectionCard>

        {/* ── Location Section Skeleton ── */}
        <SectionCard eyebrow="Location" title="Location" className="py-0" containerClassName="w-full" classes={propertySectionClasses}>
          <Skeleton className="h-[400px] w-full rounded-xl" />
        </SectionCard>

        {/* ── Amenities Section Skeleton ── */}
        <SectionCard eyebrow="Amenities" title="Amenities" className="py-0" containerClassName="w-full" classes={propertySectionClasses}>
          <PropertyAmenitiesSkeleton />
        </SectionCard>
      </PropertyContentLayout>
    </PageLayout>
  );
}
