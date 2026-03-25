import { notFound } from 'next/navigation';
import { Building2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getPropertiesAdmin } from '@/lib/db/properties/queries';
import { Property, PropertyFilters, PaginatedResult } from '@/types';
import { delay } from '@/lib/utils';
import { DataTable } from '@/components/ui/data-table';
import { Pagination } from '@/components/ui/pagination';
import { columns } from './columns';

interface PropertiesListProps {
  filters: PropertyFilters;
}

export async function PropertiesList({ filters }: PropertiesListProps) {
  await delay();

  const { success, data } = (await getPropertiesAdmin(filters)) as {
    success: boolean;
    data?: PaginatedResult<Property>;
  };

  if (!success || !data) {
    notFound();
  }

  if (data.data.length === 0) {
    return (
      <div className="flex min-h-100 flex-col items-center justify-center rounded-xl border border-border/60 bg-card p-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
          <Building2 className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-1">No properties found</h3>
        <p className="text-muted-foreground mb-4">Try adjusting your filters or add a new property.</p>
        <Button className="cursor-pointer">
          <Plus className="mr-2 h-4 w-4" />
          Add Property
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <DataTable columns={columns} data={data.data} />
      <Pagination total={data.total} page={data.page} pageSize={data.pageSize} />
    </div>
  );
}
