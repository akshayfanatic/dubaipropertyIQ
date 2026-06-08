import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { LeadsSearchFilter } from '@/components/dashboard/admin/leads/LeadsSearchFilter';
import { PageHeader } from '@/components/shared/page-header';

export const metadata: Metadata = {
  title: 'Leads | Admin Dashboard',
  description: 'View captured website leads',
};

export default function AdminLeadsListLayout({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-6">
      <PageHeader title="Leads" description="View captured inquiries, callbacks, newsletter signups, and other website leads." showBackButton />
      <LeadsSearchFilter />
      {children}
    </div>
  );
}
