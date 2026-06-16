import { Suspense } from 'react';
import { BlogCategoriesList } from '@/components/dashboard/admin/blog-categories/BlogCategoriesList';
import { TableSkeleton } from '@/components/ui/table-skeleton';
import type { BlogCategoryFilters } from '@/types/blog-category';

interface PageProps {
  searchParams: Promise<{
    search?: string;
    page?: string;
    pageSize?: string;
  }>;
}

function buildFilters(params: Awaited<PageProps['searchParams']>): BlogCategoryFilters {
  return {
    search: params.search || undefined,
    page: params.page ? Number(params.page) : 1,
    pageSize: params.pageSize ? Number(params.pageSize) : 10,
  };
}

export default async function BlogCategoriesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filters = buildFilters(params);
  const filterKey = JSON.stringify(filters);

  return (
    <Suspense key={filterKey} fallback={<TableSkeleton columns={4} rows={10} />}>
      <BlogCategoriesList filters={filters} />
    </Suspense>
  );
}
