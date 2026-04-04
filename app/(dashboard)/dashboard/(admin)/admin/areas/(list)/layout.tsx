import React from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { AreasSearchFilter } from '@/components/dashboard/admin/areas/AreasSearchFilter';

const AreasLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="space-y-6">
      <PageHeader title="Areas" description="Manage neighborhoods and communities" showBackButton action={{ label: 'Add Area', href: '/dashboard/admin/areas/new' }} />
      <AreasSearchFilter />
      {children}
    </div>
  );
};

export default AreasLayout;
