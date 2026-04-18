import { notFound } from 'next/navigation';
import { PageForm } from '@/components/pages/PageForm';
import { PageHeader } from '@/components/shared/page-header';
import { getPageById } from '@/lib/db/pages/queries';
import { WidgetCard } from '@/components/shared/WidgetCard';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPagePage({ params }: PageProps) {
  const { id } = await params;
  const result = await getPageById(id);
  const page = result.success ? result.data : null;

  if (!page) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader title={`Edit ${page.title}`} description="Update page content and settings" showBackButton />

      <WidgetCard>
        <PageForm id={id} page={page} />
      </WidgetCard>
    </div>
  );
}
