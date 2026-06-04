import { Suspense } from 'react';
import { BuildingsList } from '@/components/dashboard/admin/buildings/BuildingsList';
import { TableSkeleton } from '@/components/ui/table-skeleton';
import type { BuildingFilters } from '@/types/building';

interface PageProps {
  searchParams: Promise<{
    search?: string;
    city_id?: string;
    area_id?: string;
    developer_id?: string;
    page?: string;
    pageSize?: string;
  }>;
}

function buildFilters(params: Awaited<PageProps['searchParams']>): BuildingFilters {
  return {
    search: params.search || undefined,
    city_id: params.city_id || undefined,
    area_id: params.area_id || undefined,
    developer_id: params.developer_id || undefined,
    page: params.page ? Number(params.page) : 1,
    pageSize: params.pageSize ? Number(params.pageSize) : 10,
  };
}

export default async function BuildingsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filters = buildFilters(params);
  const filterKey = JSON.stringify(filters);

  return (
    <Suspense key={filterKey} fallback={<TableSkeleton columns={6} rows={10} />}>
      <BuildingsList filters={filters} />
    </Suspense>
  );
}
