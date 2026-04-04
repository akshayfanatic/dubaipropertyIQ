import { Suspense } from 'react';
import { AmenitiesList } from '@/components/dashboard/admin/amenities/AmenitiesList';
import { TableSkeleton } from '@/components/ui/table-skeleton';
import type { AmenityFilters } from '@/types/amenities';

interface PageProps {
  searchParams: Promise<{
    search?: string;
    page?: string;
    pageSize?: string;
  }>;
}

function buildFilters(params: Awaited<PageProps['searchParams']>): AmenityFilters {
  return {
    search: params.search || undefined,
    page: params.page ? Number(params.page) : 1,
    pageSize: params.pageSize ? Number(params.pageSize) : 10,
  };
}

export default async function AmenitiesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filters = buildFilters(params);
  const filterKey = JSON.stringify(filters);

  return (
    <Suspense key={filterKey} fallback={<TableSkeleton columns={4} rows={10} />}>
      <AmenitiesList filters={filters} />
    </Suspense>
  );
}
