import Link from 'next/link';
import { Building2, Plus } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { EmptyState } from '@/components/shared/no-item-found';
import { Pagination } from '@/components/shared/pagination';
import { getBuildingsAdmin } from '@/lib/db/buildings/queries';
import { columns } from './columns';
import type { BuildingFilters, BuildingWithRelations } from '@/types/building';
import type { PaginatedResult } from '@/types/shared';

interface BuildingsListProps {
  filters: BuildingFilters;
}

export async function BuildingsList({ filters }: BuildingsListProps) {
  const { success, data, message } = (await getBuildingsAdmin(filters)) as {
    success: boolean;
    data?: PaginatedResult<BuildingWithRelations>;
    message?: string;
  };

  if (!success || !data) {
    throw new Error(message || 'Failed to fetch buildings');
  }

  if (!data.data?.length) {
    return (
      <EmptyState
        icon={<Building2 className="h-8 w-8 text-muted-foreground" />}
        title="No buildings found"
        description={filters.search || filters.area_id || filters.city_id || filters.developer_id ? 'Try adjusting your filters.' : 'Create your first building intelligence record.'}
        action={
          <Link href="/dashboard/admin/buildings/new" className={buttonVariants({ variant: 'default' })}>
            <Plus className="mr-2 h-4 w-4" />
            Add Building
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
