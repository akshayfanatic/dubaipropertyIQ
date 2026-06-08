import { Suspense } from 'react';
import { LeadsList } from '@/components/dashboard/admin/leads/LeadsList';
import { TableSkeleton } from '@/components/ui/table-skeleton';
import type { LeadFilters, LeadSourceType, LeadStatus } from '@/types/lead';

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    sourceType?: LeadSourceType | 'all';
    status?: LeadStatus | 'all';
  }>;
}

function buildFilters(params: Awaited<PageProps['searchParams']>): LeadFilters {
  return {
    page: params.page ? Number(params.page) : 1,
    pageSize: 10,
    search: params.search,
    sourceType: params.sourceType === 'all' ? undefined : params.sourceType,
    status: params.status === 'all' ? undefined : params.status,
  };
}

export default async function AdminLeadsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filters = buildFilters(params);
  const filterKey = JSON.stringify(filters);

  return (
    <Suspense key={filterKey} fallback={<TableSkeleton columns={6} rows={10} />}>
      <LeadsList filters={filters} />
    </Suspense>
  );
}
