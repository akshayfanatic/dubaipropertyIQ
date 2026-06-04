import { Inbox } from 'lucide-react';
import { EmptyState } from '@/components/shared/no-item-found';
import { Pagination } from '@/components/shared/pagination';
import { DataTable } from '@/components/ui/data-table';
import { getLeadsAdmin } from '@/lib/db/leads/queries';
import type { Lead, LeadFilters } from '@/types/lead';
import type { PaginatedResult } from '@/types/shared';
import { columns } from './columns';

interface LeadsListProps {
  filters: LeadFilters;
}

export async function LeadsList({ filters }: LeadsListProps) {
  const { success, data, message } = (await getLeadsAdmin(filters)) as {
    success: boolean;
    data?: PaginatedResult<Lead>;
    message?: string;
  };

  if (!success || !data) {
    throw new Error(message || 'Failed to fetch leads');
  }

  if (!data.data.length) {
    return (
      <EmptyState icon={<Inbox className="h-8 w-8 text-muted-foreground" />} title="No leads found" description={filters.search ? 'Try adjusting your search.' : 'Captured leads will appear here.'} />
    );
  }

  return (
    <div className="space-y-4">
      <DataTable columns={columns} data={data.data} />
      <Pagination total={data.total} page={data.page} pageSize={data.pageSize} />
    </div>
  );
}
