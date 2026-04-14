import { Layers, Plus } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/no-item-found';
import { getAmenitiesAdmin } from '@/lib/db/amenities/queries';
import { DataTable } from '@/components/ui/data-table';
import { Pagination } from '@/components/shared/pagination';
import { columns } from './columns';
import Link from 'next/link';
import type { AmenityFilters, Amenity } from '@/types/amenities';
import type { PaginatedResult } from '@/types/shared';

interface AmenitiesListProps {
  filters: AmenityFilters;
}

export async function AmenitiesList({ filters }: AmenitiesListProps) {
  const { success, data, message } = (await getAmenitiesAdmin(filters)) as {
    success: boolean;
    data?: PaginatedResult<Amenity>;
    message?: string;
  };

  if (!success || !data) {
    throw new Error(message || 'Failed to fetch amenities');
  }

  if (!data.data?.length) {
    return (
      <EmptyState
        icon={<Layers className="h-8 w-8 text-muted-foreground" />}
        title="No amenities found"
        description={filters.search ? 'Try adjusting your search.' : 'Create your first amenity to enhance area listings.'}
        action={
          <Link href="/dashboard/admin/amenities/new" className={buttonVariants({ variant: 'default' })}>
            <Plus className="mr-2 h-4 w-4" />
            Add Amenity
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
