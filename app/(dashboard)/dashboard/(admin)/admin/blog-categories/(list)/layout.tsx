import React from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { BlogCategoriesSearchFilter } from '@/components/dashboard/admin/blog-categories/BlogCategoriesSearchFilter';

const BlogCategoriesLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="space-y-6">
      <PageHeader title="Blog Categories" description="Manage categories for blog posts" showBackButton action={{ label: 'Add Blog Category', href: '/dashboard/admin/blog-categories/new' }} />
      <BlogCategoriesSearchFilter />
      {children}
    </div>
  );
};

export default BlogCategoriesLayout;
