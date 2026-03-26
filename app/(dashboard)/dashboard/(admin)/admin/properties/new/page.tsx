import { Metadata } from 'next';
import { PropertyForm } from '@/components/dashboard/admin/properties/PropertyForm';
import { getActiveCategories } from '@/lib/db/categories/queries';
import { PageHeader } from '@/components/shared/page-header';
import type { Category } from '@/types/property';

export const metadata: Metadata = {
  title: 'Add New Property | Admin Dashboard',
  description: 'Create a new property listing',
};

export default async function NewPropertyPage() {
  // Fetch active categories for the form
  const categoriesResult = await getActiveCategories();
  const categories: Category[] = categoriesResult.success && categoriesResult.data ? categoriesResult.data : [];

  return (
    <div className="space-y-6">
      <PageHeader title="Add New Property" description="Create a new property listing" showBackButton />

      <div className="rounded-lg border bg-card p-6">
        <PropertyForm categories={categories} />
      </div>
    </div>
  );
}
