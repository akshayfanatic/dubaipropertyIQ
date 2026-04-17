import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DeveloperForm } from '@/components/dashboard/admin/developers/DeveloperForm';
import { getDeveloperById } from '@/lib/db/developers/queries';
import { PageHeader } from '@/components/shared/page-header';

interface EditDeveloperPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: 'Edit Developer | Admin Dashboard',
  description: 'Edit an existing property developer',
};

export default async function EditDeveloperPage({ params }: EditDeveloperPageProps) {
  const { id } = await params;
  const { success, data: developer } = await getDeveloperById(id);

  if (!success || !developer) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Developer" description={`Editing: ${developer.name}`} showBackButton />
      <DeveloperForm developer={developer} />
    </div>
  );
}
