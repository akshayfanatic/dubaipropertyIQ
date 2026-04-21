import { getProperties } from '@/lib/db/properties/queries';
import type { PropertyListItem } from '@/types/property';
import { Building, AlertCircle } from 'lucide-react';
import type { PaginatedResult } from '@/types/shared';
import { Pagination } from '@/components/shared/pagination';
import { EmptyState } from '@/components/shared/no-item-found';
import { PropertyCard, PropertyCardSkeleton } from '@/components/properties/card';
import { Skeleton } from '@/components/ui/skeleton';

interface SearchResultsProps {
  location?: string;
  q?: string;
  categories?: string;
  minPrice?: string;
  maxPrice?: string;
  amenities?: string | string[];
  golden_visa_eligible?: string;
  page?: string;
}

interface PropertyGridProps {
  children: React.ReactNode;
  pagination?: React.ReactNode;
}

function PropertyGrid({ children, pagination }: PropertyGridProps) {
  return (
    <div className="max-w-295 mx-auto">
      <div className="space-y-8">{children}</div>
      {<div className="mt-6">{pagination}</div>}
    </div>
  );
}

export async function SearchResults({ location, q, categories, minPrice, maxPrice, amenities, golden_visa_eligible, page }: SearchResultsProps) {
  const currentPage = parseInt(page || '1', 10);

  const response = await getProperties({
    location,
    q,
    categories,
    minPrice,
    maxPrice,
    amenities: Array.isArray(amenities) ? amenities.join(',') : amenities,
    golden_visa_eligible,
    page: currentPage,
  });

  if (!response.success || !response.data) {
    return (
      <div className="max-w-295 mx-auto">
        <EmptyState icon={<AlertCircle className="h-8 w-8 text-muted-foreground" />} title="Error" description="Failed to load properties. Please try again later." />
      </div>
    );
  }

  const paginatedResult = response.data as PaginatedResult<PropertyListItem>;
  const { data: properties, total, page: resultPage, pageSize } = paginatedResult;

  if (properties.length === 0) {
    return (
      <div className="max-w-295 mx-auto">
        <EmptyState icon={<Building className="h-8 w-8 text-muted-foreground" />} title="No Results" description={`No properties found in ${location || 'Dubai'}. Try adjusting your filters.`} />
      </div>
    );
  }

  return (
    <PropertyGrid pagination={total > pageSize ? <Pagination total={total} page={resultPage} pageSize={pageSize} /> : undefined}>
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </PropertyGrid>
  );
}

export function SearchResultsSkeleton() {
  return (
    <div className="max-w-295 mx-auto space-y-6">
      <div className="grid grid-cols-1 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <PropertyCardSkeleton key={i} />
        ))}
      </div>
      <div className="flex justify-center items-center gap-2 pt-4">
        <Skeleton className="h-9 w-9 rounded-lg" />
        <Skeleton className="h-9 w-9 rounded-lg" />
        <Skeleton className="h-9 w-9 rounded-lg" />
        <Skeleton className="h-9 w-9 rounded-lg" />
        <Skeleton className="h-9 w-9 rounded-lg" />
      </div>
    </div>
  );
}
