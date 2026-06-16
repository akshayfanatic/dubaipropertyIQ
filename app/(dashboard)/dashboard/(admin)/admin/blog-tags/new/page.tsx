import { Metadata } from 'next';
import { BlogTagForm } from '@/components/dashboard/admin/blog-tags/BlogTagForm';
import { PageHeader } from '@/components/shared/page-header';

export const metadata: Metadata = {
  title: 'Add Blog Tag | Admin Dashboard',
  description: 'Create a new blog tag',
};

export default function NewBlogTagPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Add Blog Tag" description="Create a tag for blog posts" showBackButton />

      <div className="rounded-lg border bg-card p-6">
        <BlogTagForm />
      </div>
    </div>
  );
}
