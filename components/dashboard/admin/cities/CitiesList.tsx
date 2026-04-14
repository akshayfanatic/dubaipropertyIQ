import { MapPin, Plus } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/no-item-found';
import { getCitiesAdmin } from '@/lib/db/cities/queries';
import { DataTable } from '@/components/ui/data-table';
import { Pagination } from '@/components/shared/pagination';
import { columns } from './columns';
import Link from 'next/link';
import type { CityFilters, City } from '@/types/city';
import type { PaginatedResult } from '@/types/shared';

interface CitiesListProps {
  filters: CityFilters;
}

export async function CitiesList({ filters }: CitiesListProps) {
  const { success, data, message } = (await getCitiesAdmin(filters)) as {
    success: boolean;
    data?: PaginatedResult<City>;
    message?: string;
  };

  if (!success || !data) {
    throw new Error(message || 'Failed to fetch cities');
  }

  if (!data.data?.length) {
    return (
      <EmptyState
        icon={<MapPin className="h-8 w-8 text-muted-foreground" />}
        title="No cities found"
        description={filters.search ? 'Try adjusting your search.' : 'Create your first city to organize properties by location.'}
        action={
          <Link href="/dashboard/admin/cities/new" className={buttonVariants({ variant: 'default' })}>
            <Plus className="mr-2 h-4 w-4" />
            Add City
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
