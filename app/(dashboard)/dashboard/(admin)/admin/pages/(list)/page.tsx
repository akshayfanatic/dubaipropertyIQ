import { Metadata } from 'next';
import { PagesList } from '@/components/dashboard/admin/pages/PagesList';
import { PageHeader } from '@/components/shared/page-header';
import { PageFilters } from '@/types/page';

export const metadata: Metadata = {
  title: 'Pages | Admin Dashboard',
  description: 'Manage content pages',
};

export default async function AdminPagesPage({ searchParams }: { searchParams: Promise<{ page?: string; search?: string }> }) {
  const params = await searchParams;
  const filters: PageFilters = {
    page: params.page ? Number(params.page) : 1,
    search: params.search,
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Content Pages" description="Manage legal and informational pages" />
      <PagesList filters={filters} />
    </div>
  );
}
