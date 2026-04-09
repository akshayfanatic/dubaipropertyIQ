import { PageHeader } from '@/components/shared/page-header';
import { NewUserForm } from '@/components/dashboard/admin/users/NewUserForm';

export default function NewUserPage() {
  return (
    <>
      <PageHeader title="Create User" description="Add a new user to the system" showBackButton />
      <NewUserForm />
    </>
  );
}
