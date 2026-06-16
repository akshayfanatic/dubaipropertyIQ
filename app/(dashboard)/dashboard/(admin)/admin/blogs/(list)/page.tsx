import { Metadata } from 'next';
import { Suspense } from 'react';
import { BlogsList } from '@/components/dashboard/admin/blogs/BlogsList';
import { TableSkeleton } from '@/components/ui/table-skeleton';
import type { BlogFilters, BlogPublishStatusFilter } from '@/types/blog';

export const metadata: Metadata = {
  title: 'Blogs | Admin Dashboard',
  description: 'Manage blog posts',
};

interface PageProps {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    search?: string;
    category_id?: string;
    status?: BlogPublishStatusFilter;
    tag_ids?: string | string[];
  }>;
}

function normalizeTagIds(tagIds?: string | string[]): string[] | undefined {
  const values = Array.isArray(tagIds) ? tagIds : tagIds?.split(',');
  const normalized = values?.map((value) => value.trim()).filter(Boolean);
  return normalized?.length ? normalized : undefined;
}

function buildFilters(params: Awaited<PageProps['searchParams']>): BlogFilters {
  return {
    page: params.page ? Number(params.page) : 1,
    pageSize: params.pageSize ? Number(params.pageSize) : 10,
    search: params.search || undefined,
    category_id: params.category_id || undefined,
    status: params.status && params.status !== 'all' ? params.status : undefined,
    tag_ids: normalizeTagIds(params.tag_ids),
  };
}

export default async function AdminBlogsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filters = buildFilters(params);
  const filterKey = JSON.stringify(filters);

  return (
    <Suspense key={filterKey} fallback={<TableSkeleton columns={6} rows={10} />}>
      <BlogsList filters={filters} />
    </Suspense>
  );
}
