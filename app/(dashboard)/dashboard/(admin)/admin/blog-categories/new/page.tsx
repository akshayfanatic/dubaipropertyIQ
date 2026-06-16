import { Metadata } from 'next';
import { BlogCategoryForm } from '@/components/dashboard/admin/blog-categories/BlogCategoryForm';
import { PageHeader } from '@/components/shared/page-header';

export const metadata: Metadata = {
  title: 'Add Blog Category | Admin Dashboard',
  description: 'Create a new blog category',
};

export default function NewBlogCategoryPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Add Blog Category" description="Create a category for blog posts" showBackButton />

      <div className="rounded-lg border bg-card p-6">
        <BlogCategoryForm />
      </div>
    </div>
  );
}
