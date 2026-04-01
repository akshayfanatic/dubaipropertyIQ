import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PropertyForm } from '@/components/dashboard/admin/properties/PropertyForm';
import { getCategoriesAdmin } from '@/lib/db/categories/queries';
import { getDeveloperOptionsAdmin } from '@/lib/db/developers/queries';
import { getPropertyByIdAdmin } from '@/lib/db/properties/queries';
import { PageHeader } from '@/components/shared/page-header';
import { DeveloperOption, Property } from '@/types';
import type { Category } from '@/types/category';

interface EditPropertyPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: 'Edit Property | Admin Dashboard',
  description: 'Edit an existing property listing',
};

export default async function EditPropertyPage({ params }: EditPropertyPageProps) {
  const { id } = await params;

  // Fetch property, categories, and developers in parallel
  const [propertyResult, categoriesResult, developersResult] = await Promise.all([getPropertyByIdAdmin(id), getCategoriesAdmin(), getDeveloperOptionsAdmin()]);

  // Handle property not found
  if (!propertyResult.success || !propertyResult.data) {
    notFound();
  }

  const property = propertyResult.data as Property;
  const categories: Category[] = categoriesResult.success && categoriesResult.data ? categoriesResult.data.data : [];
  const developers: DeveloperOption[] = developersResult.success && developersResult.data ? developersResult.data : [];

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Property" description={`Editing: ${property.title}`} showBackButton />

      <div className="rounded-lg border bg-card p-6">
        <PropertyForm property={property} categories={categories} developerList={developers} />
      </div>
    </div>
  );
}
