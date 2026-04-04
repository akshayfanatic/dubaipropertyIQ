import { MapPin, Plus } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/no-item-found';
import { getAreasWithCityAdmin } from '@/lib/db/areas/queries';
import { DataTable } from '@/components/ui/data-table';
import { Pagination } from '@/components/shared/pagination';
import { columns } from './columns';
import Link from 'next/link';
import type { AreaFilters } from '@/types/areas';
import type { PaginatedResult } from '@/types/shared';

interface AreaWithCity {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  photos: string[];
  city_id: string;
  created_at: string;
  updated_at: string;
  cities: {
    name: string;
    slug: string;
  } | null;
}

interface AreasListProps {
  filters: AreaFilters;
}

export async function AreasList({ filters }: AreasListProps) {
  const { success, data, message } = (await getAreasWithCityAdmin(filters)) as {
    success: boolean;
    data?: PaginatedResult<AreaWithCity>;
    message?: string;
  };

  if (!success || !data) {
    throw new Error(message || 'Failed to fetch areas');
  }

  if (data.data.length === 0) {
    return (
      <EmptyState
        icon={<MapPin className="h-8 w-8 text-muted-foreground" />}
        title="No areas found"
        description={filters.search || filters.city_id ? 'Try adjusting your search.' : 'Create your first area to organize properties by location.'}
        action={
          <Link href="/dashboard/admin/areas/new" className={buttonVariants({ variant: 'default' })}>
            <Plus className="mr-2 h-4 w-4" />
            Add Area
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
