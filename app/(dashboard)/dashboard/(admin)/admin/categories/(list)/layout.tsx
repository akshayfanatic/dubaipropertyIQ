import React from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { CategoriesSearchFilter } from '@/components/dashboard/admin/categories/CategoriesSearchFilter';

const CategoriesLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="space-y-6">
      <PageHeader title="Categories" description="Manage property categories" showBackButton action={{ label: 'Add Category', href: '/dashboard/admin/categories/new' }} />
      <CategoriesSearchFilter />
      {children}
    </div>
  );
};

export default CategoriesLayout;
