import { FileText, Plus } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/no-item-found';
import { getBlogsAdmin } from '@/lib/db/blogs/queries';
import { DataTable } from '@/components/ui/data-table';
import { Pagination } from '@/components/shared/pagination';
import { columns } from './columns';
import Link from 'next/link';
import type { BlogFilters, Blog } from '@/types/blog';
import type { PaginatedResult } from '@/types/shared';

interface BlogsListProps {
  filters: BlogFilters;
}

export async function BlogsList({ filters }: BlogsListProps) {
  const { success, data, message } = (await getBlogsAdmin(filters)) as {
    success: boolean;
    data?: PaginatedResult<Blog>;
    message?: string;
  };

  if (!success || !data) {
    throw new Error(message || 'Failed to fetch blogs');
  }

  if (!data.data?.length) {
    return (
      <EmptyState
        icon={<FileText className="h-8 w-8 text-muted-foreground" />}
        title="No blogs found"
        description={filters.search ? 'Try adjusting your search.' : 'Create your first blog.'}
        action={
          <Link href="/dashboard/admin/blogs/new" className={buttonVariants({ variant: 'default' })}>
            <Plus className="mr-2 h-4 w-4" />
            New Blog
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
