import { Suspense } from 'react';
import type { Metadata } from 'next';
import { AlertCircle, Building } from 'lucide-react';
import { EmptyState } from '@/components/shared/no-item-found';
import { Pagination } from '@/components/shared/pagination';
import { PropertyCard, PropertyCardSkeleton } from '@/components/properties/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getProperties } from '@/lib/db/properties/queries';
import type { PropertyListItem } from '@/types/property';
import type { PaginatedResult } from '@/types/shared';
import { createPageMetadata } from '@/lib/utils/seo';
import { staticImages } from '@/config';

const GOLDEN_VISA_PAGE_SIZE = 6;

export const metadata: Metadata = {
  ...createPageMetadata({
    title: 'Golden Visa Properties in Dubai | AED 2M+ Eligible Listings',
    description: 'Browse AED 2M+ Dubai properties eligible for the UAE Golden Visa and request guidance on property value, documents, application steps, and next moves.',
    path: '/golden-visa-properties',
    keywords: [
      'Golden Visa properties Dubai',
      'Dubai Golden Visa property',
      'AED 2M property Dubai',
      'UAE Golden Visa real estate',
      'Golden Visa eligible properties',
      'buy property in Dubai Golden Visa',
    ],
    image: staticImages.home.hero,
  }),
  title: 'Golden Visa Properties in Dubai | AED 2M+ Eligible Listings',
};

export const revalidate = 60;

export type GoldenVisaSearchParams = {
  q?: string;
  categories?: string;
  bedrooms?: string;
  status?: string;
  sort?: string;
  areas?: string | string[];
  minPrice?: string;
  maxPrice?: string;
  amenities?: string | string[];
  page?: string;
};

type GoldenVisaPropertiesPageProps = {
  searchParams: Promise<GoldenVisaSearchParams>;
};

export default async function GoldenVisaPropertiesPage({ searchParams }: GoldenVisaPropertiesPageProps) {
  const params = await searchParams;
  const searchKey = JSON.stringify(params);

  return (
    <Suspense fallback={<GoldenVisaPropertyResultsSkeleton />} key={searchKey}>
      {/* SERVER FILTERED PROPERTY RESULTS */}
      <GoldenVisaPropertyResults params={params} />
    </Suspense>
  );
}

async function GoldenVisaPropertyResults({ params }: { params: GoldenVisaSearchParams }) {
  const currentPage = parseInt(params.page || '1', 10);
  const response = await getProperties({
    location: params.q,
    q: params.q,
    categories: params.categories,
    bedrooms: params.bedrooms,
    status: params.status,
    sort: params.sort || 'price_desc',
    areas: Array.isArray(params.areas) ? params.areas.join(',') : params.areas,
    minPrice: params.minPrice,
    maxPrice: params.maxPrice,
    amenities: Array.isArray(params.amenities) ? params.amenities.join(',') : params.amenities,
    golden_visa_eligible: true,
    page: Number.isFinite(currentPage) ? currentPage : 1,
    pageSize: GOLDEN_VISA_PAGE_SIZE,
  });

  if (!response.success || !response.data) {
    return <EmptyState icon={<AlertCircle className="h-8 w-8 text-muted-foreground" />} title="Unable to load Golden Visa properties" description="Please try again later." />;
  }

  const paginatedResult = response.data as PaginatedResult<PropertyListItem>;
  const { data: properties, total, page, pageSize } = paginatedResult;
  const firstResult = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const lastResult = Math.min(page * pageSize, total);

  if (properties.length === 0) {
    return (
      <EmptyState
        icon={<Building className="h-8 w-8 text-muted-foreground" />}
        title="No Golden Visa listings found"
        description="Try adjusting area, property type, bedrooms, budget, or amenities."
      />
    );
  }

  return (
    <div className="w-full">
      {/* RESULTS SUMMARY */}
      <div className="mb-5 flex flex-col gap-1 border-b border-border pb-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold leading-7 text-foreground">Available Golden Visa properties</h2>
        <p className="text-sm leading-6 text-muted-foreground" aria-live="polite">
          Showing {firstResult}-{lastResult} of {total}
        </p>
      </div>

      {/* PROPERTY LIST */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

      {/* PAGINATION */}
      {total > pageSize && (
        <div className="mt-8 flex justify-center">
          <Pagination total={total} page={page} pageSize={pageSize} />
        </div>
      )}
    </div>
  );
}

function GoldenVisaPropertyResultsSkeleton() {
  return (
    <div className="w-full space-y-5">
      <div className="border-b border-border pb-3">
        <Skeleton className="h-6 w-64" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <PropertyCardSkeleton key={item} />
        ))}
      </div>
    </div>
  );
}
