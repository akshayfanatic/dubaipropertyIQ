import Link from 'next/link';
import { FolderOpen, Plus } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { EmptyState } from '@/components/shared/no-item-found';
import { Pagination } from '@/components/shared/pagination';
import { getBlogCategoriesAdmin } from '@/lib/db/blog-categories/queries';
import { columns } from './columns';
import type { BlogCategory, BlogCategoryFilters } from '@/types/blog-category';
import type { PaginatedResult } from '@/types/shared';

interface BlogCategoriesListProps {
  filters: BlogCategoryFilters;
}

export async function BlogCategoriesList({ filters }: BlogCategoriesListProps) {
  const { success, data, message } = (await getBlogCategoriesAdmin(filters)) as {
    success: boolean;
    data?: PaginatedResult<BlogCategory>;
    message?: string;
  };

  if (!success || !data) {
    throw new Error(message || 'Failed to fetch blog categories');
  }

  if (!data.data?.length) {
    return (
      <EmptyState
        icon={<FolderOpen className="h-8 w-8 text-muted-foreground" />}
        title="No blog categories found"
        description={filters.search ? 'Try adjusting your search.' : 'Create your first category to organize blog posts.'}
        action={
          <Link href="/dashboard/admin/blog-categories/new" className={buttonVariants({ variant: 'default' })}>
            <Plus className="mr-2 h-4 w-4" />
            Add Blog Category
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
