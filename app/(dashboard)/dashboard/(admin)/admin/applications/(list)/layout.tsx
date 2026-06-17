import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { AgentApplicationsSearchFilter } from '@/components/entity/partner-application/agent-application/AgentApplicationsSearchFilter';
import { PageHeader } from '@/components/shared/page-header';

export const metadata: Metadata = {
  title: 'Applications | Admin Dashboard',
  description: 'Review customer-submitted applications',
};

export default function AdminApplicationsListLayout({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-6">
      <PageHeader title="Applications" description="Review customer-submitted applications." showBackButton />
      <AgentApplicationsSearchFilter />
      {children}
    </div>
  );
}
