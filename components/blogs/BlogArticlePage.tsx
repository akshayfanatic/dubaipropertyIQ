import Link from 'next/link';
import { ArrowRight, CalendarDays, Clock3, Mail, UserRound } from 'lucide-react';

import { BlogContentRenderer } from '@/components/blogs/BlogContent';
import { BlogGuidesSection } from '@/components/home/BlogGuidesSection';
import { buttonVariants } from '@/components/ui/button';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { cn } from '@/lib/utils';
import type { Blog } from '@/types/blog';
import type { TiptapContentNode } from '@/types/shared';
import { BlogLeadForm } from '@/components/leads/BlogLeadForm';

interface BlogArticlePageProps {
  blog: Blog;
  relatedPosts: Blog[];
}

type TocItem = {
  id: string;
  text: string;
  level: number;
};

function formatDate(date?: string | null) {
  if (!date) return 'Recent';

  return new Intl.DateTimeFormat('en', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

function getTextFromNode(node: TiptapContentNode): string {
  if (node.text) return node.text;
  return node.content?.map(getTextFromNode).join('') ?? '';
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function getToc(content: Blog['content']): TocItem[] {
  return (
    content.content
      ?.filter((node) => node.type === 'heading' && typeof node.attrs?.level === 'number')
      .map((node) => {
        const text = getTextFromNode(node);
        return {
          id: slugify(text),
          text,
          level: Number(node.attrs?.level ?? 2),
        };
      })
      .filter((item) => item.text.length > 0)
      .slice(0, 8) ?? []
  );
}

function getReadTime(blog: Blog) {
  const contentText = blog.content.content?.map(getTextFromNode).join(' ') ?? '';
  const words = `${blog.title} ${blog.excerpt ?? ''} ${contentText}`.trim().split(/\s+/).filter(Boolean).length;

  return `${Math.max(4, Math.ceil(words / 180))} min read`;
}

function ArticleMeta({ blog, onImage = false }: { blog: Blog; onImage?: boolean }) {
  const items = [
    { icon: UserRound, label: 'Dubai Property IQ' },
    { icon: CalendarDays, label: formatDate(blog.created_at) },
    { icon: Clock3, label: getReadTime(blog) },
  ];

  return (
    <div className={cn('mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium', onImage ? 'text-primary-foreground/88 drop-shadow-sm' : 'text-muted-foreground')}>
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <span key={item.label} className="inline-flex items-center gap-2">
            <Icon className={cn('size-4', onImage ? 'text-primary-foreground/78' : 'text-primary')} />
            {item.label}
          </span>
        );
      })}
    </div>
  );
}

function TableOfContents({ items }: { items: TocItem[] }) {
  if (items.length === 0) {
    return (
      <div className="border-l border-border pl-4">
        <p className="text-sm font-bold text-foreground">Table of contents</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Key sections will appear here when headings are added to the guide.</p>
      </div>
    );
  }

  return (
    <nav className="border-l border-border pl-4" aria-label="Table of contents">
      <p className="text-sm font-bold text-foreground">Table of contents</p>
      <div className="mt-3 grid gap-2">
        {items.map((item) => (
          <a key={item.id} href={`#${item.id}`} className={cn('rounded-md py-1.5 text-sm leading-5 text-muted-foreground transition-colors hover:text-primary', item.level > 2 && 'pl-3')}>
            {item.text}
          </a>
        ))}
      </div>
    </nav>
  );
}

function InContentCta() {
  return (
    <div className="my-8 border-y border-border py-6">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Need a property shortlist?</p>
      <h2 className="mt-2 text-xl font-extrabold leading-tight text-foreground">Turn this guide into a search plan.</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">Compare Dubai communities, property types, and investment signals against live listings.</p>
      <Link href="/search" className={cn(buttonVariants({ size: 'lg' }), 'mt-5 gap-2 rounded-full font-bold')}>
        Search properties
        <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}

function NewsletterSignup({ blogTitle }: { blogTitle: string }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
            <Mail className="size-4" />
            Investor notes
          </p>
          <h2 className="mt-3 text-2xl font-extrabold leading-tight text-foreground">Get Dubai property insights in your inbox.</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Market guides, area signals, and calculator updates, no noise.</p>
        </div>
        <BlogLeadForm blogTitle={blogTitle} />
      </div>
    </section>
  );
}

export function BlogArticlePage({ blog, relatedPosts }: BlogArticlePageProps) {
  const featureImage = blog.feature_image_url;
  const tocItems = getToc(blog.content);

  return (
    <>
      <section className={cn('relative overflow-hidden', featureImage?.url ? 'flex min-h-[460px] items-center bg-foreground' : 'bg-background')}>
        {featureImage?.url && (
          <>
            <ImageWithFallback src={featureImage.url} alt={featureImage.alt_tag || blog.title} fill priority className="object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,oklch(0.18_0.04_260.47_/_0.58),oklch(0.18_0.04_260.47_/_0.34),oklch(0.18_0.04_260.47_/_0.14))]" />
          </>
        )}
        <div className={cn('relative z-10 mx-auto w-[min(92%,960px)] py-14 sm:py-18', featureImage?.url && 'w-[min(92%,1080px)]')}>
          <div className={cn(featureImage?.url && 'max-w-4xl rounded-2xl border border-primary-foreground/14 bg-foreground/34 p-5 shadow-xl shadow-foreground/20 backdrop-blur-[2px] sm:p-7')}>
            <span
              className={cn(
                'inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] before:h-0.5 before:w-5.5 before:rounded-full before:content-[""]',
                featureImage?.url ? 'text-primary-foreground/92 before:bg-primary-foreground/80' : 'text-primary before:bg-primary',
              )}
            >
              Guide
            </span>
            <h1 className={cn('mt-5 text-4xl font-extrabold leading-[1.08] tracking-normal sm:text-5xl', featureImage?.url ? 'max-w-4xl text-primary-foreground drop-shadow-sm' : 'text-foreground')}>
              {blog.title}
            </h1>
            {blog.excerpt && (
              <p className={cn('mt-5 max-w-3xl text-base leading-7 sm:text-lg', featureImage?.url ? 'text-primary-foreground/92 drop-shadow-sm' : 'text-muted-foreground')}>{blog.excerpt}</p>
            )}
            <ArticleMeta blog={blog} onImage={Boolean(featureImage?.url)} />
          </div>
        </div>
      </section>

      <main className="bg-background">
        <div className="mx-auto grid w-[min(92%,1180px)] gap-8 border-t border-border py-10 lg:grid-cols-[240px_minmax(0,760px)] lg:justify-center lg:py-12">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <TableOfContents items={tocItems} />
          </aside>

          <article className="min-w-0">
            <BlogContentRenderer content={blog.content} />
            <InContentCta />
          </article>
        </div>

        {relatedPosts.length > 0 && (
          <section className="bg-muted/45 py-14 sm:py-16">
            <div className="mx-auto w-[min(92%,1440px)]">
              <div className="mb-8 max-w-[640px]">
                <span className="inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-primary before:h-0.5 before:w-5.5 before:rounded-full before:bg-primary before:content-['']">
                  Related posts
                </span>
                <h2 className="mt-3 text-[clamp(1.9rem,3.6vw,2.9rem)] font-extrabold leading-[1.12] tracking-normal text-foreground">Keep reading</h2>
              </div>
              <BlogGuidesSection blogs={relatedPosts.slice(0, 3)} />
            </div>
          </section>
        )}

        <section className="py-14 sm:py-16">
          <div className="mx-auto w-[min(92%,1180px)]">
            <NewsletterSignup blogTitle={blog.title} />
          </div>
        </section>
      </main>
    </>
  );
}
