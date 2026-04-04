import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CityForm } from '@/components/dashboard/admin/cities/CityForm';
import { getCityById } from '@/lib/db/cities/queries';
import { PageHeader } from '@/components/shared/page-header';

interface EditCityPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: 'Edit City | Admin Dashboard',
  description: 'Edit an existing city',
};

export default async function EditCityPage({ params }: EditCityPageProps) {
  const { id } = await params;
  const { success, data: city } = await getCityById(id);

  if (!success || !city) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Edit City" description={`Editing: ${city.name}`} showBackButton />

      <div className="rounded-lg border bg-card p-6">
        <CityForm city={city} />
      </div>
    </div>
  );
}
