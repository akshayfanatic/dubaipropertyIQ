import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AreaForm } from '@/components/dashboard/admin/areas/AreaForm';
import { getAreaByIdAdmin } from '@/lib/db/areas/queries';
import { PageHeader } from '@/components/shared/page-header';

interface EditAreaPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: 'Edit Area | Admin Dashboard',
  description: 'Edit an existing neighborhood/community',
};

export default async function EditAreaPage({ params }: EditAreaPageProps) {
  const { id } = await params;
  const { success, data: area } = await getAreaByIdAdmin(id);

  if (!success || !area) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Area" description={`Editing: ${area.name}`} showBackButton />

      <AreaForm area={area} />
    </div>
  );
}
