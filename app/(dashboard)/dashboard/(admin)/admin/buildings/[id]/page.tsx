import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BuildingForm } from '@/components/dashboard/admin/buildings/BuildingForm';
import { PageHeader } from '@/components/shared/page-header';
import { getBuildingByIdAdmin } from '@/lib/db/buildings/queries';

interface EditBuildingPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: 'Edit Building | Admin Dashboard',
  description: 'Edit an existing building intelligence record',
};

export default async function EditBuildingPage({ params }: EditBuildingPageProps) {
  const { id } = await params;
  const { success, data: building } = await getBuildingByIdAdmin(id);

  if (!success || !building) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Building" description={`Editing: ${building.name}`} showBackButton />
      <BuildingForm building={building} />
    </div>
  );
}
