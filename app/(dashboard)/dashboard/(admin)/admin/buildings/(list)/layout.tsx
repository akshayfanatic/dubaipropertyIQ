import React from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { BuildingsSearchFilter } from '@/components/dashboard/admin/buildings/BuildingsSearchFilter';

const BuildingsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="space-y-6">
      <PageHeader title="Buildings" description="Manage area-linked building intelligence reports" showBackButton action={{ label: 'Add Building', href: '/dashboard/admin/buildings/new' }} />
      <BuildingsSearchFilter />
      {children}
    </div>
  );
};

export default BuildingsLayout;
