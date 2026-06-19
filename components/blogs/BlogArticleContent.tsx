import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { BlogContentRenderer } from '@/components/blogs/BlogContent';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Blog } from '@/types/blog';

// Responsibility: render the Tiptap article body and the in-content property-search CTA.
type BlogArticleContentProps = Pick<Blog, 'content'>;

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

export function BlogArticleContent({ content }: BlogArticleContentProps) {
  return (
    <>
      <BlogContentRenderer content={content} />
      <InContentCta />
    </>
  );
}
