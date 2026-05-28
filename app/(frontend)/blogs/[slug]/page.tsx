import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBlogBySlug, getPublishedBlogs } from '@/lib/db/blogs/queries';
import { BlogContentRenderer } from '@/components/blogs/BlogContent';
import PageLayout from '@/components/layout/PageLayout';
import { PageBanner } from '@/components/shared/PageBanner';
import { PublicBreadCrumb } from '@/components/shared/PublicBreadCrumb';

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

  return {
    title: blog.meta_title || blog.title,
    description: blog.meta_description || blog.excerpt || '',
    openGraph: {
      title: blog.meta_title || blog.title,
      description: blog.meta_description || blog.excerpt || '',
      images: blog.feature_image_url?.url ? [{ url: blog.feature_image_url.url, alt: blog.feature_image_url.alt_tag || blog.title }] : undefined,
    },
  };
}

export default async function BlogPage({ params }: PageProps) {
  const { slug } = await params;
  const result = await getBlogBySlug(slug);
  const blog = result.success ? result.data : null;

  if (!blog) {
    notFound();
  }

  const featureImage = blog.feature_image_url;
  const hasFeatureImage = Boolean(featureImage?.url);
  const titleClassName = hasFeatureImage
    ? 'text-3xl font-semibold leading-tight text-primary-foreground sm:text-4xl lg:text-5xl'
    : 'text-3xl font-semibold leading-tight text-foreground sm:text-4xl lg:text-5xl';

  return (
    <PageLayout contentFullWidth wrapperClassName="py-0">
      <div className="container mx-auto px-4 py-3 sm:px-6 lg:px-8">
        <PublicBreadCrumb />
      </div>

      <PageBanner
        imageUrl={featureImage?.url}
        alt={featureImage?.alt_tag || blog.title}
        heightClassName="min-h-[320px] sm:min-h-[420px]"
        overlayClassName="bg-foreground/55"
        contentClassName="container mx-auto flex min-h-[320px] items-center justify-center px-4 py-12 text-center sm:min-h-[420px] sm:px-6 lg:px-8"
        className={!hasFeatureImage ? 'bg-muted' : undefined}
      >
        <div className="mx-auto max-w-4xl">
          <h1 className={titleClassName}>{blog.title}</h1>
        </div>
      </PageBanner>

      <article className="mx-auto px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="container mx-auto">
          <BlogContentRenderer content={blog.content} />
        </div>
      </article>
    </PageLayout>
  );
}
