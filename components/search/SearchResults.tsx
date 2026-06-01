import { getProperties } from '@/lib/db/properties/queries';
import type { PropertyListItem } from '@/types/property';
import { Building, AlertCircle } from 'lucide-react';
import type { PaginatedResult } from '@/types/shared';
import { Pagination } from '@/components/shared/pagination';
import { EmptyState } from '@/components/shared/no-item-found';
import { PropertyCardTile, PropertyCardTileSkeleton } from '@/components/properties/card';
import { Skeleton } from '@/components/ui/skeleton';

interface SearchResultsProps {
  location?: string;
  q?: string;
  categories?: string;
  minPrice?: string;
  maxPrice?: string;
  amenities?: string | string[];
  golden_visa_eligible?: string;
  is_featured?: string;
  page?: string;
}

interface PropertyGridProps {
  children: React.ReactNode;
  pagination?: React.ReactNode;
}

function PropertyGrid({ children, pagination }: PropertyGridProps) {
  return (
    <div className="w-full">
      <div className="space-y-4 sm:space-y-5">{children}</div>
      {pagination && <div className="mt-8 flex justify-center">{pagination}</div>}
    </div>
  );
}

export async function SearchResults({ location, q, categories, minPrice, maxPrice, amenities, golden_visa_eligible, is_featured, page }: SearchResultsProps) {
  const currentPage = parseInt(page || '1', 10);

  const response = await getProperties({
    location,
    q,
    categories,
    minPrice,
    maxPrice,
    amenities: Array.isArray(amenities) ? amenities.join(',') : amenities,
    golden_visa_eligible,
    is_featured,
    page: currentPage,
  });

  if (!response.success || !response.data) {
    return (
      <div className="w-full">
        <EmptyState icon={<AlertCircle className="h-8 w-8 text-muted-foreground" />} title="Error" description="Failed to load properties. Please try again later." />
      </div>
    );
  }

  const paginatedResult = response.data as PaginatedResult<PropertyListItem>;
  const { data: properties, total, page: resultPage, pageSize } = paginatedResult;
  const firstResult = total === 0 ? 0 : (resultPage - 1) * pageSize + 1;
  const lastResult = Math.min(resultPage * pageSize, total);

  if (properties.length === 0) {
    return (
      <div className="w-full">
        <EmptyState icon={<Building className="h-8 w-8 text-muted-foreground" />} title="No Results" description={`No properties found in ${location || 'Dubai'}. Try adjusting your filters.`} />
      </div>
    );
  }

  return (
    <PropertyGrid pagination={total > pageSize ? <Pagination total={total} page={resultPage} pageSize={pageSize} /> : undefined}>
      <div className="flex flex-col gap-1 border-b pb-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold leading-7 text-foreground">Available properties</h2>
        <p className="text-sm leading-6 text-muted-foreground" aria-live="polite">
          Showing {firstResult}-{lastResult} of {total}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:gap-5">
        {properties.map((property) => (
          <PropertyCardTile key={property.id} property={property} />
        ))}
      </div>
    </PropertyGrid>
  );
}

export function SearchResultsSkeleton() {
  return (
    <div className="w-full space-y-5">
      <div className="border-b pb-3">
        <Skeleton className="h-6 w-48" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:gap-5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <PropertyCardTileSkeleton key={i} />
        ))}
      </div>
      <div className="flex items-center justify-center gap-2 pt-2">
        <Skeleton className="h-9 w-9 rounded-lg" />
        <Skeleton className="h-9 w-9 rounded-lg" />
        <Skeleton className="h-9 w-9 rounded-lg" />
        <Skeleton className="h-9 w-9 rounded-lg" />
        <Skeleton className="h-9 w-9 rounded-lg" />
      </div>
    </div>
  );
}
