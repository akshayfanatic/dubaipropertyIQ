import { Building2, Plus } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/no-item-found';
import { getPropertiesAdmin } from '@/lib/db/properties/queries';
import { PropertyListItem, PropertyFilters, PaginatedResult } from '@/types/property';
import { delay } from '@/lib/utils';
import { DataTable } from '@/components/ui/data-table';
import { Pagination } from '@/components/ui/pagination';
import { columns } from './columns';
import Link from 'next/link';

interface PropertiesListProps {
  filters: PropertyFilters;
}

export async function PropertiesList({ filters }: PropertiesListProps) {
  await delay();

  const { success, data, error } = (await getPropertiesAdmin(filters)) as {
    success: boolean;
    data?: PaginatedResult<PropertyListItem>;
    error?: string;
  };

  if (!success || !data) {
    throw new Error(error || 'Failed to fetch properties');
  }

  if (data.data.length === 0) {
    return (
      <EmptyState
        icon={<Building2 className="h-8 w-8 text-muted-foreground" />}
        title="No properties found"
        description="Try adjusting your filters or add a new property."
        action={
          <Link href={'/dashboard/admin/properties/new'} className={`${buttonVariants({ variant: 'default' })}`}>
            <Plus className="mr-2 h-4 w-4" />
            Add Property
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
