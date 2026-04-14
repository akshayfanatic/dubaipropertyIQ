import { Metadata } from 'next';
import { PropertyForm } from '@/components/dashboard/admin/properties/PropertyForm';
import { PageHeader } from '@/components/shared/page-header';

export const metadata: Metadata = {
  title: 'Add New Property | Admin Dashboard',
  description: 'Create a new property listing',
};

export default async function NewPropertyPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Add New Property" description="Create a new property listing" showBackButton />

      <div className="rounded-lg border bg-card p-6">
        <PropertyForm />
      </div>
    </div>
  );
}
