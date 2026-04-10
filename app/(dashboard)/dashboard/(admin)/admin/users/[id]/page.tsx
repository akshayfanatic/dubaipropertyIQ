import { notFound } from 'next/navigation';
import { UserForm } from '@/components/dashboard/admin/users/UserForm';
import { getUserByIdAdmin } from '@/lib/db/users/queries';
import { PageHeader } from '@/components/shared/page-header';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function UserEditPage({ params }: PageProps) {
  const { id } = await params;
  const { success, data } = await getUserByIdAdmin(id);

  if (!success || !data) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Edit User" description="Update user role and permissions" showBackButton />

      <UserForm user={data} />
    </div>
  );
}
