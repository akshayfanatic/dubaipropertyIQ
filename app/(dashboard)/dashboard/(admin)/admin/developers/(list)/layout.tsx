import React from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { DevelopersSearchFilter } from '@/components/dashboard/admin/developers/DevelopersSearchFilter';

const DevelopersLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="space-y-6">
      <PageHeader title="Developers" description="Manage property developers and their trust scores" showBackButton action={{ label: 'Add Developer', href: '/dashboard/admin/developers/new' }} />
      <DevelopersSearchFilter />
      {children}
    </div>
  );
};

export default DevelopersLayout;
