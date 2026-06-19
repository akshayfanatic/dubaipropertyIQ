'use client';

import { cn } from '@/lib/utils';
import type { Blog } from '@/types/blog';
import { useEffect, useState } from 'react';
import { getBlogTableOfContents, type BlogTocItem } from './blog-article-utils';

// Responsibility: derive and render the article table of contents from Tiptap heading nodes.
type BlogTableOfContentsProps = Pick<Blog, 'content'>;

function getHeadingLevel(tagName: string) {
  return Number(tagName.replace('H', ''));
}

function getRenderedHeadings(): BlogTocItem[] {
  return Array.from(document.querySelectorAll<HTMLElement>('[data-blog-article-content] h1, [data-blog-article-content] h2, [data-blog-article-content] h3, [data-blog-article-content] h4'))
    .map((heading) => ({
      id: heading.id,
      text: heading.textContent?.trim() ?? '',
      level: getHeadingLevel(heading.tagName),
    }))
    .filter((item) => item.id && item.text);
}

export function BlogTableOfContents({ content }: BlogTableOfContentsProps) {
  const [items, setItems] = useState<BlogTocItem[]>(() => getBlogTableOfContents(content));

  useEffect(() => {
    function syncRenderedHeadings() {
      const renderedItems = getRenderedHeadings();

      if (renderedItems.length > 0) {
        setItems(renderedItems);
      }
    }

    const frame = requestAnimationFrame(syncRenderedHeadings);
    window.addEventListener('blog-content-headings-ready', syncRenderedHeadings);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('blog-content-headings-ready', syncRenderedHeadings);
    };
  }, []);

  function scrollToHeading(id: string) {
    const heading = document.getElementById(id);

    if (!heading) return;

    heading.scrollIntoView({ behavior: 'smooth', block: 'center' });
    window.history.replaceState(null, '', `#${id}`);
  }

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
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(event) => {
              event.preventDefault();
              scrollToHeading(item.id);
            }}
            className={cn('rounded-md py-1.5 text-sm leading-5 text-muted-foreground transition-colors hover:text-primary', item.level > 2 && 'pl-3')}
          >
            {item.text}
          </a>
        ))}
      </div>
    </nav>
  );
}
