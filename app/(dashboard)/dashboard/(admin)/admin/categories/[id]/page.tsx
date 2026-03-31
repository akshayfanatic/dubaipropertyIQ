import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CategoryForm } from '@/components/dashboard/admin/categories/CategoryForm';
import { getCategoryById } from '@/lib/db/categories/queries';
import { PageHeader } from '@/components/shared/page-header';

interface EditCategoryPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: 'Edit Category | Admin Dashboard',
  description: 'Edit an existing property category',
};
export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const { id } = await params;
  const { success, data: category } = await getCategoryById(id);

  if (!success || !category) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Category" description={`Editing: ${category.name}`} showBackButton />

      <div className="rounded-lg border bg-card p-6">
        <CategoryForm category={category} />
      </div>
    </div>
  );
}
