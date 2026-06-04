import PageLayout from '@/components/layout/PageLayout';
import { PropertyGallerySkeleton, SideBarContentSkeleton, PropertyInfoSkeleton, PropertyAttributesSkeleton, DeveloperInfoSkeleton } from '@/components/properties/PropertySkeletons';
import { PropertyContentLayout } from '@/components/properties/layout/PropertyContent';
import { SectionCard } from '@/components/shared/SectionCard';
import { ScrollToTopOnMount } from '@/components/shared/ScrollToTopOnMount';
import { Skeleton } from '@/components/ui/skeleton';

const propertySectionClasses = {
  wrapper: 'mb-9 gap-4',
  eyebrow: 'text-xs font-extrabold tracking-[0.15em] before:w-[22px]',
  title: 'text-[clamp(1.35rem,2.4vw,1.9rem)] leading-tight',
};

export default function Loading() {
  return (
    <PageLayout className="py-2 space-y-4 px-4" breadcrumb={<Skeleton className="h-6 w-64 mb-4" />}>
      <ScrollToTopOnMount />

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

        <Skeleton className="h-40 w-full rounded-2xl" />
      </PropertyContentLayout>
    </PageLayout>
  );
}
