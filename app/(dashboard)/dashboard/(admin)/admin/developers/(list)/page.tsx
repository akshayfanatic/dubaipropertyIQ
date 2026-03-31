import { Suspense } from 'react';
import { DevelopersList } from '@/components/dashboard/admin/developers/DevelopersList';
import { TableSkeleton } from '@/components/ui/table-skeleton';
import type { DeveloperFilters } from '@/types/developer';

interface PageProps {
  searchParams: Promise<{
    search?: string;
    page?: string;
    pageSize?: string;
  }>;
}

function buildFilters(params: Awaited<PageProps['searchParams']>): DeveloperFilters {
  return {
    search: params.search || undefined,
    page: params.page ? Number(params.page) : 1,
    pageSize: params.pageSize ? Number(params.pageSize) : 10,
  };
}

export default async function DevelopersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filters = buildFilters(params);
  const filterKey = JSON.stringify(filters);

  return (
    <Suspense key={filterKey} fallback={<TableSkeleton columns={5} rows={10} />}>
      <DevelopersList filters={filters} />
    </Suspense>
  );
}
