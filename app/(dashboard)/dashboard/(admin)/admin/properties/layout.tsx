import React from 'react';
import { TopBarFilter } from './_components/TopBarFilter';
import { PageHeader } from './_ui';

const PropertyLayoutPage = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="space-y-6">
      <PageHeader title="Properties" description="Manage your property listings" actionLabel="Add Property" />
      <TopBarFilter />
      {children}
    </div>
  );
};

export default PropertyLayoutPage;
