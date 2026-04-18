'use client';

import { TiptapEditor } from '@/components/shared/editor/TiptapEditor';
import { type PageContent } from '@/types/page';

interface PageContentProps {
  content: PageContent;
}

/**
 * Render Tiptap JSON content as read-only editor
 */
export function PageContentRenderer({ content }: PageContentProps) {
  return <TiptapEditor content={content} onChange={() => {}} editable={false} />;
}
