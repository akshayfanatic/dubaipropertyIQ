import { Suspense } from 'react';
import { BlogTagsList } from '@/components/dashboard/admin/blog-tags/BlogTagsList';
import { TableSkeleton } from '@/components/ui/table-skeleton';
import type { BlogTagFilters } from '@/types/blog-tag';

interface PageProps {
  searchParams: Promise<{
    search?: string;
    page?: string;
    pageSize?: string;
  }>;
}

function buildFilters(params: Awaited<PageProps['searchParams']>): BlogTagFilters {
  return {
    search: params.search || undefined,
    page: params.page ? Number(params.page) : 1,
    pageSize: params.pageSize ? Number(params.pageSize) : 10,
  };
}

export default async function BlogTagsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filters = buildFilters(params);
  const filterKey = JSON.stringify(filters);

  return (
    <Suspense key={filterKey} fallback={<TableSkeleton columns={4} rows={10} />}>
      <BlogTagsList filters={filters} />
    </Suspense>
  );
}
