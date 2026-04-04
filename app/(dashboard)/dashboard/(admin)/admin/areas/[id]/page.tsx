import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AreaForm } from '@/components/dashboard/admin/areas/AreaForm';
import { getAreaById } from '@/lib/db/areas/queries';
import { PageHeader } from '@/components/shared/page-header';
import { Area } from '@/types/areas';

interface EditAreaPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: 'Edit Area | Admin Dashboard',
  description: 'Edit an existing neighborhood/community',
};

export default async function EditAreaPage({ params }: EditAreaPageProps) {
  const { id } = await params;
  const { success, data: area } = await getAreaById(id);

  if (!success || !area) {
    notFound();
  }

  // Convert AreaWithCity to Area for the form, handling null -> undefined conversion
  const areaForForm: Area = {
    id: area.id,
    city_id: area.city_id,
    name: area.name,
    slug: area.slug,
    description: area.description || undefined,
    photos: area.photos,
    created_at: area.created_at,
    updated_at: area.updated_at,
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Area" description={`Editing: ${area.name}`} showBackButton />

      <div className="rounded-lg border bg-card p-6">
        <AreaForm area={areaForForm} />
      </div>
    </div>
  );
}
