import { BlogGuidesSection } from '@/components/home/BlogGuidesSection';
import PageLayout from '@/components/layout/PageLayout';
import { JsonLd } from '@/components/shared/JsonLd';
import { PublicBreadCrumb } from '@/components/shared/PublicBreadCrumb';
import { SectionCard } from '@/components/shared/SectionCard';
import { getPublishedBlogs } from '@/lib/db/blogs/queries';
import { createPageMetadata } from '@/lib/utils/seo';
import { createBlogsCollectionSchema, createBreadcrumbSchema } from '@/lib/utils/structured-data';

export const metadata = createPageMetadata({
  title: 'Dubai Property Guides',
  description: 'Read Dubai property market guides, investor insights, and area research.',
  path: '/blogs',
  keywords: ['Dubai property guides', 'Dubai real estate market', 'Dubai investor insights', 'Dubai area research'],
});

export const revalidate = 60;

export default async function BlogsPage() {
  const result = await getPublishedBlogs();
  const blogs = result.success ? (result.data ?? []) : [];

  return (
    <PageLayout contentFullWidth breadcrumb={<PublicBreadCrumb />} wrapperClassName="py-0">
      <SectionCard eyebrow="Market insights" title="Guides for smarter investors" description="Read Dubai property market guides, investor insights, and area research." className="bg-background">
        <BlogGuidesSection blogs={blogs} />
      </SectionCard>
      <JsonLd
        id="blogs-structured-data"
        data={[
          createBlogsCollectionSchema(blogs),
          createBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Dubai Property Guides', path: '/blogs' },
          ]),
        ]}
      />
    </PageLayout>
  );
}
