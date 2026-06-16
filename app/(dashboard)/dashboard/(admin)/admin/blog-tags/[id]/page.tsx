import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlogTagForm } from '@/components/dashboard/admin/blog-tags/BlogTagForm';
import { getBlogTagById } from '@/lib/db/blog-tags/queries';
import { PageHeader } from '@/components/shared/page-header';

interface EditBlogTagPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: 'Edit Blog Tag | Admin Dashboard',
  description: 'Edit an existing blog tag',
};

export default async function EditBlogTagPage({ params }: EditBlogTagPageProps) {
  const { id } = await params;
  const { success, data: tag } = await getBlogTagById(id);

  if (!success || !tag) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Blog Tag" description={`Editing: ${tag.name}`} showBackButton />

      <div className="rounded-lg border bg-card p-6">
        <BlogTagForm id={id} tag={tag} />
      </div>
    </div>
  );
}
