import { Suspense } from 'react';
import { BlogResults, BlogResultsSkeleton, type BlogResultsParams } from '@/components/blogs/BlogResults';
import { createPageMetadata } from '@/lib/utils/seo';

type BlogsPageProps = {
  searchParams: Promise<BlogResultsParams>;
};

export const metadata = createPageMetadata({
  title: 'Dubai Property Guides',
  description: 'Read Dubai property market guides, investor insights, and area research.',
  path: '/blogs',
  keywords: ['Dubai property guides', 'Dubai real estate market', 'Dubai investor insights', 'Dubai area research'],
});

export const revalidate = 60;

export default async function BlogsPage({ searchParams }: BlogsPageProps) {
  const params = await searchParams;
  const searchKey = JSON.stringify(params);

  return (
    <Suspense fallback={<BlogResultsSkeleton />} key={searchKey}>
      <BlogResults params={params} />
    </Suspense>
  );
}
