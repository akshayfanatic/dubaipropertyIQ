import Link from 'next/link';
import { Plus, Tags } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { EmptyState } from '@/components/shared/no-item-found';
import { Pagination } from '@/components/shared/pagination';
import { getBlogTagsAdmin } from '@/lib/db/blog-tags/queries';
import { columns } from './columns';
import type { BlogTag, BlogTagFilters } from '@/types/blog-tag';
import type { PaginatedResult } from '@/types/shared';

interface BlogTagsListProps {
  filters: BlogTagFilters;
}

export async function BlogTagsList({ filters }: BlogTagsListProps) {
  const { success, data, message } = (await getBlogTagsAdmin(filters)) as {
    success: boolean;
    data?: PaginatedResult<BlogTag>;
    message?: string;
  };

  if (!success || !data) {
    throw new Error(message || 'Failed to fetch blog tags');
  }

  if (!data.data?.length) {
    return (
      <EmptyState
        icon={<Tags className="h-8 w-8 text-muted-foreground" />}
        title="No blog tags found"
        description={filters.search ? 'Try adjusting your search.' : 'Create your first tag to label blog posts.'}
        action={
          <Link href="/dashboard/admin/blog-tags/new" className={buttonVariants({ variant: 'default' })}>
            <Plus className="mr-2 h-4 w-4" />
            Add Blog Tag
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <DataTable columns={columns} data={data.data} />
      <Pagination total={data.total} page={data.page} pageSize={data.pageSize} />
    </div>
  );
}
