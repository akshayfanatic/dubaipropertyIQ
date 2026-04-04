import React from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { CitiesSearchFilter } from '@/components/dashboard/admin/cities/CitiesSearchFilter';

const CitiesLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="space-y-6">
      <PageHeader title="Cities" description="Manage UAE cities" showBackButton action={{ label: 'Add City', href: '/dashboard/admin/cities/new' }} />
      <CitiesSearchFilter />
      {children}
    </div>
  );
};

export default CitiesLayout;
