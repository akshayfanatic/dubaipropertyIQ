import { Suspense } from 'react';
import { AgentApplicationsList } from '@/components/entity/partner-application/agent-application/AgentApplicationsList';
import { TableSkeleton } from '@/components/ui/table-skeleton';
import type { AgentPartnerApplicationFilters, PartnerApplicationStatus } from '@/types/partner-application';

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: PartnerApplicationStatus | 'all';
  }>;
}

function buildFilters(params: Awaited<PageProps['searchParams']>): AgentPartnerApplicationFilters {
  return {
    page: params.page ? Number(params.page) : 1,
    pageSize: 10,
    search: params.search,
    status: params.status === 'all' ? undefined : params.status,
  };
}

export default async function AdminApplicationsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filters = buildFilters(params);
  const filterKey = JSON.stringify(filters);

  return (
    <Suspense key={filterKey} fallback={<TableSkeleton columns={6} rows={10} />}>
      <AgentApplicationsList filters={filters} />
    </Suspense>
  );
}
