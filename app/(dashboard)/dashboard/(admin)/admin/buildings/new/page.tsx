import type { Metadata } from 'next';
import { BuildingForm } from '@/components/dashboard/admin/buildings/BuildingForm';
import { PageHeader } from '@/components/shared/page-header';

export const metadata: Metadata = {
  title: 'Add New Building | Admin Dashboard',
  description: 'Create a new building intelligence record',
};

export default function NewBuildingPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Add New Building" description="Create a building intelligence record linked to an area" showBackButton />
      <BuildingForm />
    </div>
  );
}
