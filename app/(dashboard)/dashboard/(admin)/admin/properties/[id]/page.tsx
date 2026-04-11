import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PropertyForm } from '@/components/dashboard/admin/properties/PropertyForm';
import { getPropertyByIdAdmin } from '@/lib/db/properties/queries';
import { PageHeader } from '@/components/shared/page-header';
import { Property } from '@/types';

interface EditPropertyPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: 'Edit Property | Admin Dashboard',
  description: 'Edit an existing property listing',
};

export default async function EditPropertyPage({ params }: EditPropertyPageProps) {
  const { id } = await params;

  const propertyResult = await getPropertyByIdAdmin(id);

  // Handle property not found
  if (!propertyResult.success || !propertyResult.data) {
    notFound();
  }

  const property = propertyResult.data as Property;

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Property" description={`Editing: ${property.title}`} showBackButton />

      <div className="rounded-lg border bg-card p-6">
        <PropertyForm property={property} />
      </div>
    </div>
  );
}
