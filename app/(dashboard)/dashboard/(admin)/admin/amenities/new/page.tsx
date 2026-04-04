import { Metadata } from 'next';
import { AmenityForm } from '@/components/dashboard/admin/amenities/AmenityForm';
import { PageHeader } from '@/components/shared/page-header';

export const metadata: Metadata = {
  title: 'Add New Amenity | Admin Dashboard',
  description: 'Create a new area amenity',
};

export default function NewAmenityPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Add New Amenity" description="Create a new area amenity" showBackButton />

      <div className="rounded-lg border bg-card p-6">
        <AmenityForm />
      </div>
    </div>
  );
}
