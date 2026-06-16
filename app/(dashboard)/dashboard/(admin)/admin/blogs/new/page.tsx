import { Metadata } from 'next';
import { BlogForm } from '@/components/blogs/BlogForm';
import { PageHeader } from '@/components/shared/page-header';
import { WidgetCard } from '@/components/shared/WidgetCard';

export const metadata: Metadata = {
  title: 'Add New Blog | Admin Dashboard',
  description: 'Create a new blog post',
};

export default function NewBlogPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Add New Blog" description="Create a new blog post or article" showBackButton />

      <WidgetCard>
        <BlogForm />
      </WidgetCard>
    </div>
  );
}
