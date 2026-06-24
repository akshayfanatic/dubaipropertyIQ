import { BriefcaseBusiness } from 'lucide-react';
import { EmptyState } from '@/components/shared/no-item-found';
import { Pagination } from '@/components/shared/pagination';
import { DataTable } from '@/components/ui/data-table';
import { getAgentApplicationsAdmin } from '@/lib/db/partner-applications/queries';
import type { AgentPartnerApplicationFilters, PartnerApplicationWithAgentDetails } from '@/types/partner-application';
import type { PaginatedResult } from '@/types/shared';
import { columns } from './columns';

interface AgentApplicationsListProps {
  filters: AgentPartnerApplicationFilters;
}

export async function AgentApplicationsList({ filters }: AgentApplicationsListProps) {
  const { success, data, message } = (await getAgentApplicationsAdmin(filters)) as {
    success: boolean;
    data?: PaginatedResult<PartnerApplicationWithAgentDetails>;
    message?: string;
  };

  if (!success || !data) {
    throw new Error(message || 'Failed to fetch agent applications');
  }

  if (!data.data.length) {
    return (
      <EmptyState
        icon={<BriefcaseBusiness className="h-8 w-8 text-muted-foreground" />}
        title="No applications found"
        description={filters.search ? 'Try adjusting your search.' : 'Agent applications will appear here.'}
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
