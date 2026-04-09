import { Suspense } from 'react';
import { UsersList } from '@/components/dashboard/admin/users/UsersList';
import { TableSkeleton } from '@/components/ui/table-skeleton';

interface PageProps {
  searchParams: Promise<{
    search?: string;
    role?: string;
    page?: string;
    pageSize?: string;
  }>;
}

function buildFilters(params: Awaited<PageProps['searchParams']>) {
  return {
    search: params.search || undefined,
    role: params.role || undefined,
    page: params.page ? Number(params.page) : 1,
    pageSize: params.pageSize ? Number(params.pageSize) : 10,
  };
}

export default async function UsersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filters = buildFilters(params);
  const filterKey = JSON.stringify(filters);

  return (
    <Suspense key={filterKey} fallback={<TableSkeleton columns={6} rows={10} />}>
      <UsersList filters={filters} />
    </Suspense>
  );
}
