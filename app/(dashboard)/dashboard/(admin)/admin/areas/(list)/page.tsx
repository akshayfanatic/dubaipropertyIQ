import { Suspense } from 'react';
import { AreasList } from '@/components/dashboard/admin/areas/AreasList';
import { TableSkeleton } from '@/components/ui/table-skeleton';
import type { AreaFilters } from '@/types/areas';

interface PageProps {
  searchParams: Promise<{
    search?: string;
    city?: string;
    page?: string;
    pageSize?: string;
  }>;
}

function buildFilters(params: Awaited<PageProps['searchParams']>): AreaFilters {
  const cityId = params.city;
  return {
    search: params.search || undefined,
    city_id: cityId && cityId !== 'all' ? cityId : undefined,
    page: params.page ? Number(params.page) : 1,
    pageSize: params.pageSize ? Number(params.pageSize) : 10,
  };
}

export default async function AreasPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filters = buildFilters(params);
  const filterKey = JSON.stringify(filters);

  return (
    <Suspense key={filterKey} fallback={<TableSkeleton columns={5} rows={10} />}>
      <AreasList filters={filters} />
    </Suspense>
  );
}
