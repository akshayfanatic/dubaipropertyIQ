import { Tag, Plus } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/no-item-found';
import { getAllCategories } from '@/lib/db/categories/queries';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';
import Link from 'next/link';

export async function CategoriesList() {
  const { success, data, message } = await getAllCategories();

  if (!success || !data) {
    throw new Error(message || 'Failed to fetch categories');
  }

  if (data.length === 0) {
    return (
      <EmptyState
        icon={<Tag className="h-8 w-8 text-muted-foreground" />}
        title="No categories found"
        description="Create your first category to organize properties."
        action={
          <Link href="/dashboard/admin/categories/new" className={buttonVariants({ variant: 'default' })}>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Link>
        }
      />
    );
  }

  return <DataTable columns={columns} data={data} />;
}
