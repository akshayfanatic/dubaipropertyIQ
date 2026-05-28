import { Metadata } from 'next';
import { BlogsList } from '@/components/dashboard/admin/blogs/BlogsList';
import { PageHeader } from '@/components/shared/page-header';
import { BlogFilters } from '@/types/blog';

export const metadata: Metadata = {
  title: 'Blogs | Admin Dashboard',
  description: 'Manage blog posts',
};

export default async function AdminBlogsPage({ searchParams }: { searchParams: Promise<{ page?: string; search?: string }> }) {
  const params = await searchParams;
  const filters: BlogFilters = {
    page: params.page ? Number(params.page) : 1,
    search: params.search,
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Blogs" description="Manage blog posts and articles" action={{ label: 'Add Blog', href: '/dashboard/admin/blogs/new' }} />
      <BlogsList filters={filters} />
    </div>
  );
}
