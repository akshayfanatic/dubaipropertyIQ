import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPageBySlug, getPublishedPages } from '@/lib/db/pages/queries';
import { PageContentRenderer } from '@/components/pages/PageContent';
import { PageHeader } from '@/components/shared/page-header';
import PageLayout from '@/components/layout/PageLayout';
import { JsonLd } from '@/components/shared/JsonLd';
import { PublicBreadCrumb } from '@/components/shared/PublicBreadCrumb';
import { ContactLeadForm } from '@/components/leads/ContactLeadForm';
import { SectionCard } from '@/components/shared/SectionCard';
import { createPageMetadata } from '@/lib/utils/seo';
import { createBreadcrumbSchema, createContentPageSchema } from '@/lib/utils/structured-data';

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

  const seo = page.pages_seo;

  return createPageMetadata({
    title: seo?.meta_title || page.title,
    description: seo?.meta_description || page.excerpt || '',
    path: seo?.canonical_url || `/pages/${page.slug}`,
    keywords: seo?.keywords,
    image: seo?.og_image_url,
  });
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
      {slug === 'contact' && (
        <SectionCard
          eyebrow="Contact"
          title="Send Us a Message"
          description="Share your request and our team will follow up with the right context."
          className="py-8"
          containerClassName="w-full"
          contentClassName="rounded-[18px] border border-border bg-card p-[clamp(1.25rem,3vw,2rem)] shadow-[0_14px_34px_oklch(0.2_0.03_263.61_/_0.10)]"
          classes={{
            wrapper: 'mb-6',
            eyebrow: 'text-xs font-extrabold tracking-[0.15em] before:w-[22px]',
            title: 'text-[clamp(1.5rem,2.6vw,2.2rem)] leading-tight',
            description: 'max-w-[560px]',
          }}
        >
          <ContactLeadForm />
        </SectionCard>
      )}
      <JsonLd
        id="content-page-structured-data"
        data={[
          createContentPageSchema(page),
          createBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: page.title, path: `/pages/${page.slug}` },
          ]),
        ]}
      />
    </PageLayout>
  );
}
