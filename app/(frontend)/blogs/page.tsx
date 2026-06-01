import { BlogGuidesSection } from '@/components/home/BlogGuidesSection';
import PageLayout from '@/components/layout/PageLayout';
import { PublicBreadCrumb } from '@/components/shared/PublicBreadCrumb';
import { SectionCard } from '@/components/shared/SectionCard';
import { getPublishedBlogs } from '@/lib/db/blogs/queries';

export const metadata = {
  title: 'Dubai Property Guides',
  description: 'Read Dubai property market guides, investor insights, and area research.',
};

export const revalidate = 60;

export default async function BlogsPage() {
  const result = await getPublishedBlogs();
  const blogs = result.success ? (result.data ?? []) : [];

  return (
    <PageLayout contentFullWidth breadcrumb={<PublicBreadCrumb />} wrapperClassName="py-0">
      <SectionCard eyebrow="Market insights" title="Guides for smarter investors" description="Read Dubai property market guides, investor insights, and area research." className="bg-background">
        <BlogGuidesSection blogs={blogs} />
      </SectionCard>
    </PageLayout>
  );
}
