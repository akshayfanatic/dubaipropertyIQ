'use client';

import { TiptapEditor } from '@/components/shared/editor/TiptapEditor';
import { type BlogContent } from '@/types/blog';
import { useEffect, useRef } from 'react';
import { getUniqueHeadingId } from './blog-article-utils';

interface BlogContentProps {
  content: BlogContent;
}

/**
 * Render Tiptap JSON content as read-only editor
 */
export function BlogContentRenderer({ content }: BlogContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const headings = contentRef.current?.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const counts = new Map<string, number>();

      headings?.forEach((heading) => {
        const text = heading.textContent?.trim();

        if (!text) return;

        heading.id = getUniqueHeadingId(text, counts);
      });

      window.dispatchEvent(new CustomEvent('blog-content-headings-ready'));
    });

    return () => cancelAnimationFrame(frame);
  }, [content]);

  return (
    <div ref={contentRef} data-blog-article-content>
      <TiptapEditor content={content} onChange={() => {}} editable={false} />
    </div>
  );
}
