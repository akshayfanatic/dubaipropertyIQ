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
import PropertyContentCard from '@/components/properties/card/PropertyContentCard';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <PageLayout className="py-2 space-y-4 px-4" breadcrumb={<Skeleton className="h-6 w-64 mb-4" />}>
      {/* ── Gallery Section Skeleton ── */}
      <PropertyGallerySkeleton />

      <PropertyContentLayout SidebarContent={<SideBarContentSkeleton />}>
        {/* Title & Price & Description Skeleton */}
        <PropertyInfoSkeleton />

        {/* ── Developer Section Skeleton ── */}
        <PropertyContentCard title="Developer">
          <DeveloperInfoSkeleton />
        </PropertyContentCard>

        {/* ── Key Information Section Skeleton ── */}
        <PropertyContentCard title="Key Information" className="gap-2">
          <PropertyAttributesSkeleton />
        </PropertyContentCard>

        {/* ── Location Section Skeleton ── */}
        <PropertyContentCard title="Location" className="gap-2">
          <Skeleton className="h-[400px] w-full rounded-xl" />
        </PropertyContentCard>

        {/* ── Amenities Section Skeleton ── */}
        <PropertyContentCard title="Amenities" className="gap-2">
          <PropertyAmenitiesSkeleton />
        </PropertyContentCard>
      </PropertyContentLayout>
    </PageLayout>
  );
}
