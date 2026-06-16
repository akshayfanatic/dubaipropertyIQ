import React from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { BlogTagsSearchFilter } from '@/components/dashboard/admin/blog-tags/BlogTagsSearchFilter';

const BlogTagsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="space-y-6">
      <PageHeader title="Blog Tags" description="Manage tags for blog posts" showBackButton action={{ label: 'Add Blog Tag', href: '/dashboard/admin/blog-tags/new' }} />
      <BlogTagsSearchFilter />
      {children}
    </div>
  );
};

export default BlogTagsLayout;
