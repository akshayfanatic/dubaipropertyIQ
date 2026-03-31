import { Metadata } from 'next';
import { DeveloperForm } from '@/components/dashboard/admin/developers/DeveloperForm';
import { PageHeader } from '@/components/shared/page-header';

export const metadata: Metadata = {
  title: 'Add New Developer | Admin Dashboard',
  description: 'Create a new property developer',
};

export default function NewDeveloperPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Add New Developer" description="Create a new property developer" showBackButton />

      <div className="rounded-lg border bg-card p-6">
        <DeveloperForm />
      </div>
    </div>
  );
}
