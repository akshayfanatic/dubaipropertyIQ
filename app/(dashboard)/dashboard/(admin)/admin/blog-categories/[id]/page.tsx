import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlogCategoryForm } from '@/components/dashboard/admin/blog-categories/BlogCategoryForm';
import { getBlogCategoryById } from '@/lib/db/blog-categories/queries';
import { PageHeader } from '@/components/shared/page-header';

interface EditBlogCategoryPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: 'Edit Blog Category | Admin Dashboard',
  description: 'Edit an existing blog category',
};

export default async function EditBlogCategoryPage({ params }: EditBlogCategoryPageProps) {
  const { id } = await params;
  const { success, data: category } = await getBlogCategoryById(id);

  if (!success || !category) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Blog Category" description={`Editing: ${category.name}`} showBackButton />

      <div className="rounded-lg border bg-card p-6">
        <BlogCategoryForm id={id} category={category} />
      </div>
    </div>
  );
}
