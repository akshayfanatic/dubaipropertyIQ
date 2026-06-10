import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBlogBySlug, getPublishedBlogs } from '@/lib/db/blogs/queries';
import { BlogArticlePage } from '@/components/blogs/BlogArticlePage';
import PageLayout from '@/components/layout/PageLayout';
import { PublicBreadCrumb } from '@/components/shared/PublicBreadCrumb';
import { createPageMetadata } from '@/lib/utils/seo';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const result = await getPublishedBlogs();
  const blogs = result.data ?? [];
  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getBlogBySlug(slug);
  const blog = result.success ? result.data : null;

  if (!blog) {
    return {
      title: 'Blog Not Found',
    };
  }

  const seo = blog.blogs_seo;
  const title = seo?.meta_title || blog.title;
  const description = seo?.meta_description || blog.excerpt || '';
  const image = seo?.og_image_url || blog.feature_image_url?.url;

  return createPageMetadata({
    title,
    description,
    path: seo?.canonical_url || `/blogs/${blog.slug}`,
    keywords: seo?.keywords,
    image,
    imageAlt: blog.feature_image_url?.alt_tag || blog.title,
    type: 'article',
  });
}

export default async function BlogPage({ params }: PageProps) {
  const { slug } = await params;
  const [result, publishedResult] = await Promise.all([getBlogBySlug(slug), getPublishedBlogs()]);
  const blog = result.success ? result.data : null;

  if (!blog) {
    notFound();
  }

  const relatedPosts = (publishedResult.success ? (publishedResult.data ?? []) : []).filter((item) => item.id !== blog.id).slice(0, 3);

  return (
    <PageLayout contentFullWidth wrapperClassName="py-0">
      <div className="container mx-auto px-4 py-3 sm:px-6 lg:px-8">
        <PublicBreadCrumb />
      </div>

      <BlogArticlePage blog={blog} relatedPosts={relatedPosts} />
    </PageLayout>
  );
}
