import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPageBySlug, getPublishedPages } from '@/lib/db/pages/queries';
import { PageContentRenderer } from '@/components/pages/PageContent';
import { PageHeader } from '@/components/shared/page-header';
import PageLayout from '@/components/layout/PageLayout';
import { PublicBreadCrumb } from '@/components/shared/PublicBreadCrumb';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const result = await getPublishedPages();
  const pages = result.data ?? [];
  return pages.map((page) => ({
    slug: page.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPageBySlug(slug);
  const page = result.success ? result.data : null;

  if (!page) {
    return {
      title: 'Page Not Found',
    };
  }

  return {
    title: page.meta_title || page.title,
    description: page.meta_description || page.excerpt || '',
  };
}

export default async function PagePage({ params }: PageProps) {
  const { slug } = await params;
  const result = await getPageBySlug(slug);
  const page = result.success ? result.data : null;

  if (!page) {
    notFound();
  }

  return (
    <PageLayout className="space-y-4" breadcrumb={<PublicBreadCrumb />}>
      <PageHeader title={page.title} />
      <PageContentRenderer content={page.content ?? ''} />
    </PageLayout>
  );
}
