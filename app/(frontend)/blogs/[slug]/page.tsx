import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBlogBySlug, getPublishedBlogs } from '@/lib/db/blogs/queries';
import { BlogArticleContent } from '@/components/blogs/BlogArticleContent';
import { BlogArticlePage } from '@/components/blogs/BlogArticlePage';
import { BlogBannerContent } from '@/components/blogs/BlogBannerContent';
import { BlogTableOfContents } from '@/components/blogs/BlogTableOfContents';
import { getBlogReadTime } from '@/components/blogs/blog-article-utils';
import { BlogGuidesSection } from '@/components/home/BlogGuidesSection';
import { NewsletterContent } from '@/components/home/NewsletterSection';
import PageLayout from '@/components/layout/PageLayout';
import { JsonLd, type SchemaJsonLd } from '@/components/shared/JsonLd';
import { PageBanner } from '@/components/shared/PageBanner';
import { PublicBreadCrumb } from '@/components/shared/PublicBreadCrumb';
import { SectionCard } from '@/components/shared/SectionCard';
import { createPageMetadata } from '@/lib/utils/seo';
import { createBlogPostingSchema, createBlogWebPageSchema, createBreadcrumbSchema } from '@/lib/utils/structured-data';
import { cn } from '@/lib/utils';

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

  const readTime = getBlogReadTime({
    title: blog.title,
    excerpt: blog.excerpt,
    content: blog.content,
  });

  const featureImageUrl = blog.feature_image_url?.url;
  const hasFeatureImage = Boolean(featureImageUrl);
  const blogSchemas: SchemaJsonLd[] = [
    createBlogPostingSchema(blog),
    createBlogWebPageSchema(blog),
    createBreadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Dubai Property Guides', path: '/blogs' },
      { name: blog.title, path: `/blogs/${blog.slug}` },
    ]),
  ];

  return (
    <PageLayout contentFullWidth wrapperClassName="py-0">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-3 sm:px-6 lg:px-8">
        <PublicBreadCrumb />
      </div>

      {/* Blog banner */}
      <PageBanner
        imageUrl={featureImageUrl}
        alt={blog.feature_image_url?.alt_tag || blog.title}
        heightClassName={hasFeatureImage ? 'min-h-[460px]' : 'min-h-0'}
        overlayClassName="bg-[linear-gradient(90deg,oklch(0.18_0.04_260.47_/_0.58),oklch(0.18_0.04_260.47_/_0.34),oklch(0.18_0.04_260.47_/_0.14))]"
        contentClassName={cn('mx-auto w-[min(92%,960px)] py-14 sm:py-18', hasFeatureImage && 'w-[min(92%,1080px)]')}
        className={cn(!hasFeatureImage && 'bg-background')}
      >
        <BlogBannerContent title={blog.title} excerpt={blog.excerpt} created_at={blog.created_at} readTime={readTime} onImage={hasFeatureImage} />
      </PageBanner>

      {/* Article */}
      <BlogArticlePage tableOfContents={<BlogTableOfContents content={blog.content} />} article={<BlogArticleContent content={blog.content} />}>
        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <SectionCard eyebrow="Related posts" title="Keep reading" className="bg-muted/45 py-14 sm:py-16">
            <BlogGuidesSection blogs={relatedPosts} limit={3} />
          </SectionCard>
        )}

        {/* Newsletter */}
        <SectionCard className="bg-background" contentClassName="card-entrance overflow-hidden rounded-3xl border border-border bg-card shadow-lg shadow-foreground/8">
          <NewsletterContent />
        </SectionCard>
      </BlogArticlePage>

      {/* Structured data */}
      <JsonLd id="blog-detail-structured-data" data={blogSchemas} />
    </PageLayout>
  );
}
