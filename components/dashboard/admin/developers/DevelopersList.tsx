import { Building2, Plus } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/no-item-found';
import { getDevelopersAdmin } from '@/lib/db/developers/queries';
import { DataTable } from '@/components/ui/data-table';
import { Pagination } from '@/components/shared/pagination';
import { columns } from './columns';
import Link from 'next/link';
import type { DeveloperFilters, Developer } from '@/types/developer';
import type { PaginatedResult } from '@/types/shared';

interface DevelopersListProps {
  filters: DeveloperFilters;
}

export async function DevelopersList({ filters }: DevelopersListProps) {
  const { success, data, message } = (await getDevelopersAdmin(filters)) as {
    success: boolean;
    data?: PaginatedResult<Developer>;
    message?: string;
  };

  if (!success || !data) {
    throw new Error(message || 'Failed to fetch developers');
  }

  if (data.data.length === 0) {
    return (
      <EmptyState
        icon={<Building2 className="h-8 w-8 text-muted-foreground" />}
        title="No developers found"
        description={filters.search ? 'Try adjusting your search.' : 'Add your first developer to start tracking trust scores.'}
        action={
          <Link href="/dashboard/admin/developers/new" className={buttonVariants({ variant: 'default' })}>
            <Plus className="mr-2 h-4 w-4" />
            Add Developer
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
