import { Suspense } from 'react';
import { CategoriesList } from '@/components/dashboard/admin/categories/CategoriesList';
import { TableSkeleton } from '@/components/ui/table-skeleton';
import { PageHeader } from '@/components/shared/page-header';
import { buttonVariants } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Categories" description="Manage property categories" />
        <Link href="/dashboard/admin/categories/new" className={buttonVariants({ variant: 'default' })}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Link>
      </div>

      <Suspense fallback={<TableSkeleton columns={4} rows={5} />}>
        <CategoriesList />
      </Suspense>
    </div>
  );
}
