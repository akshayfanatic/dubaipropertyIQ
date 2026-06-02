import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import type { Blog } from '@/types/blog';

interface BlogGuidesSectionProps {
  blogs: Blog[];
  limit?: number;
}

function formatBlogDate(date?: string | null) {
  if (!date) return 'Recent';

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}

function getBlogTag(blog: Blog, index: number) {
  const title = blog.title.toLowerCase();

  if (title.includes('forecast') || title.includes('market')) return 'Forecast';
  if (title.includes('area') || title.includes('community')) return 'Areas';
  if (title.includes('off-plan') || title.includes('off plan')) return 'Off-Plan';

  return ['Insight', 'Guide', 'Market'][index % 3];
}

function getReadTime(blog: Blog) {
  const source = `${blog.title} ${blog.excerpt ?? ''}`;
  const words = source.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(4, Math.ceil(words / 180));

  return `${minutes} min read`;
}

function BlogGuideCard({ blog, index }: { blog: Blog; index: number }) {
  const image = blog.feature_image_url;
  const tag = getBlogTag(blog, index);

  return (
    <article
      className="card-entrance group overflow-hidden rounded-2xl border border-border bg-background shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <Link href={`/blogs/${blog.slug}`} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
        <div className="relative h-45 overflow-hidden bg-muted">
          <ImageWithFallback
            src={image?.url}
            alt={image?.alt_tag || blog.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-106"
            fallbackClassName="rounded-none bg-muted"
          />
          <div className="absolute inset-x-0 top-0 h-22 bg-linear-to-b from-foreground/50 to-transparent" />
          <Badge className="absolute left-3 top-3 rounded-full border-0 bg-primary px-3 py-1 text-xs font-bold text-primary-foreground shadow-sm">{tag}</Badge>
        </div>

        <div className="p-5">
          <div className="mb-3 flex items-center gap-3 text-xs font-semibold text-muted-foreground">
            <span>{getReadTime(blog)}</span>
            <span>·</span>
            <span>{formatBlogDate(blog.created_at)}</span>
          </div>

          <h3 className="line-clamp-2 text-lg font-bold leading-6 text-foreground transition-colors group-hover:text-primary">{blog.title}</h3>

          {blog.excerpt && <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">{blog.excerpt}</p>}

          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary">
            Read guide
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:animate-float-x" />
          </span>
        </div>
      </Link>
    </article>
  );
}

export function BlogGuidesSection({ blogs, limit }: BlogGuidesSectionProps) {
  if (blogs.length === 0) return null;
  const visibleBlogs = typeof limit === 'number' ? blogs.slice(0, limit) : blogs;

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
      {visibleBlogs.map((blog, index) => (
        <BlogGuideCard key={blog.id} blog={blog} index={index} />
      ))}
    </div>
  );
}
