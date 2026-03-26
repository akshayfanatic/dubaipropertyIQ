import React from 'react';

import { PageHeader } from '@/components/shared/page-header';
import { TopBarFilter } from '@/components/dashboard/admin/properties/filter/TopBarFilter';
import PropertiesLoading from './loading';

const PropertyLayoutPage = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="space-y-6">
      <PageHeader title="Properties" description="Manage your property listings" showBackButton action={{ label: 'Add Property', href: '/dashboard/admin/properties/new' }} />
      <TopBarFilter />
      {children}
    </div>
  );
};

export default PropertyLayoutPage;
