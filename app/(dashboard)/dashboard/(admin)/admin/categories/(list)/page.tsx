import { Suspense } from 'react';
import { CategoriesList } from '@/components/dashboard/admin/categories/CategoriesList';
import { TableSkeleton } from '@/components/ui/table-skeleton';
import type { CategoryFilters } from '@/types/category';

interface PageProps {
  searchParams: Promise<{
    search?: string;
    page?: string;
    pageSize?: string;
  }>;
}

function buildFilters(params: Awaited<PageProps['searchParams']>): CategoryFilters {
  return {
    search: params.search || undefined,
    page: params.page ? Number(params.page) : 1,
    pageSize: params.pageSize ? Number(params.pageSize) : 10,
  };
}

export default async function CategoriesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filters = buildFilters(params);
  const filterKey = JSON.stringify(filters);

  return (
    <Suspense key={filterKey} fallback={<TableSkeleton columns={4} rows={10} />}>
      <CategoriesList filters={filters} />
    </Suspense>
  );
}
