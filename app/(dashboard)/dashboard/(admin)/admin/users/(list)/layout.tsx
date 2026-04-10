import React from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { UsersSearchFilter } from '@/components/dashboard/admin/users/UsersSearchFilter';

const UsersLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="space-y-6">
      <PageHeader title="Users" description="Manage user accounts and roles" action={{ label: 'Add User', href: '/dashboard/admin/users/new' }} showBackButton />
      <UsersSearchFilter />
      {children}
    </div>
  );
};

export default UsersLayout;
