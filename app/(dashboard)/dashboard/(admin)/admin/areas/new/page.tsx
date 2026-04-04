import { Metadata } from 'next';
import { AreaForm } from '@/components/dashboard/admin/areas/AreaForm';
import { PageHeader } from '@/components/shared/page-header';

export const metadata: Metadata = {
  title: 'Add New Area | Admin Dashboard',
  description: 'Create a new neighborhood/community',
};

export default function NewAreaPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Add New Area" description="Create a new neighborhood/community" showBackButton />

      <div className="rounded-lg border bg-card p-6">
        <AreaForm />
      </div>
    </div>
  );
}
