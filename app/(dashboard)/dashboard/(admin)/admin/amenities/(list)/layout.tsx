import React from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { AmenitiesSearchFilter } from '@/components/dashboard/admin/amenities/AmenitiesSearchFilter';

const AmenitiesLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="space-y-6">
      <PageHeader title="Amenities" description="Manage area amenities" showBackButton action={{ label: 'Add Amenity', href: '/dashboard/admin/amenities/new' }} />
      <AmenitiesSearchFilter />
      {children}
    </div>
  );
};

export default AmenitiesLayout;
