import { PageHeader } from '@/components/shared/page-header';
import { BlogsSearchFilter } from '@/components/dashboard/admin/blogs/BlogsSearchFilter';

export default function BlogsListLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <PageHeader title="Blogs" description="Manage blog posts and articles" showBackButton action={{ label: 'Add Blog', href: '/dashboard/admin/blogs/new' }} />
      <BlogsSearchFilter />
      {children}
    </div>
  );
}
