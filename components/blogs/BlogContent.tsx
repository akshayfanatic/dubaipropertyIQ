'use client';

import { TiptapEditor } from '@/components/shared/editor/TiptapEditor';
import { type BlogContent } from '@/types/blog';

interface BlogContentProps {
  content: BlogContent;
}

/**
 * Render Tiptap JSON content as read-only editor
 */
export function BlogContentRenderer({ content }: BlogContentProps) {
  return <TiptapEditor content={content} onChange={() => {}} editable={false} />;
}
