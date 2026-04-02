import { Metadata } from 'next';
import { CityForm } from '@/components/dashboard/admin/cities/CityForm';
import { PageHeader } from '@/components/shared/page-header';

export const metadata: Metadata = {
  title: 'Add New City | Admin Dashboard',
  description: 'Create a new city',
};

export default function NewCityPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Add New City" description="Create a new city" showBackButton />

      <div className="rounded-lg border bg-card p-6">
        <CityForm />
      </div>
    </div>
  );
}
