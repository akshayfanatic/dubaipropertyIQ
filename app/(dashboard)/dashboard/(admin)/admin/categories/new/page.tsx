import { Metadata } from 'next';
import { CategoryForm } from '@/components/dashboard/admin/categories/CategoryForm';
import { PageHeader } from '@/components/shared/page-header';

export const metadata: Metadata = {
  title: 'Add New Category | Admin Dashboard',
  description: 'Create a new property category',
};

export default function NewCategoryPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Add New Category" description="Create a new property category" showBackButton />

      <div className="rounded-lg border bg-card p-6">
        <CategoryForm />
      </div>
    </div>
  );
}
