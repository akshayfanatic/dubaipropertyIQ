import type { Metadata } from 'next';
import { LeadsList } from '@/components/dashboard/admin/leads/LeadsList';
import { PageHeader } from '@/components/shared/page-header';
import type { LeadFilters, LeadSourceType, LeadStatus } from '@/types/lead';

export const metadata: Metadata = {
  title: 'Leads | Admin Dashboard',
  description: 'View captured website leads',
};

export default async function AdminLeadsPage({ searchParams }: { searchParams: Promise<{ page?: string; search?: string; sourceType?: LeadSourceType; status?: LeadStatus }> }) {
  const params = await searchParams;
  const filters: LeadFilters = {
    page: params.page ? Number(params.page) : 1,
    pageSize: 20,
    search: params.search,
    sourceType: params.sourceType,
    status: params.status,
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Leads" description="View captured inquiries, callbacks, newsletter signups, and other website leads." showBackButton />
      <LeadsList filters={filters} />
    </div>
  );
}
