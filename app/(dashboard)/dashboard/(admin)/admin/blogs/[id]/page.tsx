import { notFound } from 'next/navigation';
import { BlogForm } from '@/components/blogs/BlogForm';
import { PageHeader } from '@/components/shared/page-header';
import { getBlogById } from '@/lib/db/blogs/queries';
import { WidgetCard } from '@/components/shared/WidgetCard';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPage({ params }: PageProps) {
  const { id } = await params;
  const result = await getBlogById(id);
  const blog = result.success ? result.data : null;

  if (!blog) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader title={`Edit ${blog.title}`} description="Update blog content and settings" showBackButton />

      <WidgetCard>
        <BlogForm id={id} blog={blog} />
      </WidgetCard>
    </div>
  );
}
