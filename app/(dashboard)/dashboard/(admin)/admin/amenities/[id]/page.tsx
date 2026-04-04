import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AmenityForm } from '@/components/dashboard/admin/amenities/AmenityForm';
import { getAmenityById } from '@/lib/db/amenities/queries';
import { PageHeader } from '@/components/shared/page-header';

interface EditAmenityPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: 'Edit Amenity | Admin Dashboard',
  description: 'Edit an existing area amenity',
};

export default async function EditAmenityPage({ params }: EditAmenityPageProps) {
  const { id } = await params;
  const { success, data: amenity } = await getAmenityById(id);

  if (!success || !amenity) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Amenity" description={`Editing: ${amenity.name}`} showBackButton />

      <div className="rounded-lg border bg-card p-6">
        <AmenityForm amenity={amenity} />
      </div>
    </div>
  );
}
