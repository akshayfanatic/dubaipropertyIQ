import { FileText, Plus } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/no-item-found';
import { getPagesAdmin } from '@/lib/db/pages/queries';
import { DataTable } from '@/components/ui/data-table';
import { Pagination } from '@/components/shared/pagination';
import { columns } from './columns';
import Link from 'next/link';
import type { PageFilters, Page } from '@/types/page';
import type { PaginatedResult } from '@/types/shared';

interface PagesListProps {
  filters: PageFilters;
}

export async function PagesList({ filters }: PagesListProps) {
  const { success, data, message } = (await getPagesAdmin(filters)) as {
    success: boolean;
    data?: PaginatedResult<Page>;
    message?: string;
  };

  if (!success || !data) {
    throw new Error(message || 'Failed to fetch pages');
  }

  if (!data.data?.length) {
    return (
      <EmptyState
        icon={<FileText className="h-8 w-8 text-muted-foreground" />}
        title="No pages found"
        description={filters.search ? 'Try adjusting your search.' : 'Create your first page.'}
        action={
          <Link href="/dashboard/admin/pages/new" className={buttonVariants({ variant: 'default' })}>
            <Plus className="mr-2 h-4 w-4" />
            New Page
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
