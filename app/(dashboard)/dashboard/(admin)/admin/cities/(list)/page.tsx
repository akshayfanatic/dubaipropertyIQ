import { Suspense } from 'react';
import { CitiesList } from '@/components/dashboard/admin/cities/CitiesList';
import { TableSkeleton } from '@/components/ui/table-skeleton';
import type { CityFilters } from '@/types/city';

interface PageProps {
  searchParams: Promise<{
    search?: string;
    page?: string;
    pageSize?: string;
  }>;
}

function buildFilters(params: Awaited<PageProps['searchParams']>): CityFilters {
  return {
    search: params.search || undefined,
    page: params.page ? Number(params.page) : 1,
    pageSize: params.pageSize ? Number(params.pageSize) : 10,
  };
}

export default async function CitiesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filters = buildFilters(params);
  const filterKey = JSON.stringify(filters);

  return (
    <Suspense key={filterKey} fallback={<TableSkeleton columns={4} rows={10} />}>
      <CitiesList filters={filters} />
    </Suspense>
  );
}
