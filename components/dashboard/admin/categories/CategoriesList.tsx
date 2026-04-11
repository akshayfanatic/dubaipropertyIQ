import { Tag, Plus } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/no-item-found';
import { getCategoriesAdmin } from '@/lib/db/categories/queries';
import { DataTable } from '@/components/ui/data-table';
import { Pagination } from '@/components/shared/pagination';
import { columns } from './columns';
import Link from 'next/link';
import type { CategoryFilters, Category } from '@/types/category';
import type { PaginatedResult } from '@/types/shared';

interface CategoriesListProps {
  filters: CategoryFilters;
}

export async function CategoriesList({ filters }: CategoriesListProps) {
  const { success, data, message } = (await getCategoriesAdmin(filters)) as {
    success: boolean;
    data?: PaginatedResult<Category>;
    message?: string;
  };

  if (!success || !data) {
    throw new Error(message || 'Failed to fetch categories');
  }

  if (!data.data?.length) {
    return (
      <EmptyState
        icon={<Tag className="h-8 w-8 text-muted-foreground" />}
        title="No categories found"
        description={filters.search ? 'Try adjusting your search.' : 'Create your first category to organize properties.'}
        action={
          <Link href="/dashboard/admin/categories/new" className={buttonVariants({ variant: 'default' })}>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
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
