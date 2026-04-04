import { Metadata } from 'next';
import { PropertyForm } from '@/components/dashboard/admin/properties/PropertyForm';
import { getCategoriesAdmin } from '@/lib/db/categories/queries';
import { getDeveloperOptionsAdmin } from '@/lib/db/developers/queries';
import { PageHeader } from '@/components/shared/page-header';
import type { Category } from '@/types/category';
import type { DeveloperOption } from '@/types';

export const metadata: Metadata = {
  title: 'Add New Property | Admin Dashboard',
  description: 'Create a new property listing',
};

export default async function NewPropertyPage() {
  // Fetch categories and developers in parallel
  const [categoriesResult, developersResult] = await Promise.all([getCategoriesAdmin(), getDeveloperOptionsAdmin()]);
  const categories: Category[] = categoriesResult.success && categoriesResult.data ? categoriesResult.data.data : [];
  const developers: DeveloperOption[] = developersResult.success && developersResult.data ? developersResult.data : [];

  return (
    <div className="space-y-6">
      <PageHeader title="Add New Property" description="Create a new property listing" showBackButton />

      <div className="rounded-lg border bg-card p-6">
        <PropertyForm categories={categories} developerList={developers} />
      </div>
    </div>
  );
}
