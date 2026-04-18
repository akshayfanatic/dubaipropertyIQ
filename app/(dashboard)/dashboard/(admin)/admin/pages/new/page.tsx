import { Metadata } from 'next';
import { PageForm } from '@/components/pages/PageForm';
import { PageHeader } from '@/components/shared/page-header';

export const metadata: Metadata = {
  title: 'Add New Page | Admin Dashboard',
  description: 'Create a new content page',
};

export default function NewPagePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Add New Page" description="Create a new content page (Privacy Policy, Terms, etc.)" showBackButton />

      <div className="rounded-lg border bg-card p-6">
        <PageForm />
      </div>
    </div>
  );
}
