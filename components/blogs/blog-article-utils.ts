import type { Blog } from '@/types/blog';
import type { TiptapContentNode } from '@/types/shared';

export type BlogTocItem = {
  id: string;
  text: string;
  level: number;
};

export function getTextFromNode(node: TiptapContentNode): string {
  if (node.text) return node.text;
  return node.content?.map(getTextFromNode).join('') ?? '';
}

function slugifyHeading(value: string) {
  return (
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'section'
  );
}

export function getUniqueHeadingId(text: string, counts: Map<string, number>) {
  const baseId = slugifyHeading(text);
  const count = counts.get(baseId) ?? 0;
  counts.set(baseId, count + 1);

  return count === 0 ? baseId : `${baseId}-${count + 1}`;
}

export function getBlogTableOfContents(content: Blog['content']): BlogTocItem[] {
  const counts = new Map<string, number>();

  return (
    content.content
      ?.filter((node) => node.type === 'heading' && typeof node.attrs?.level === 'number')
      .map((node) => {
        const text = getTextFromNode(node).trim();

        return {
          id: getUniqueHeadingId(text, counts),
          text,
          level: Number(node.attrs?.level ?? 2),
        };
      })
      .filter((item) => item.text.length > 0) ?? []
  );
}

export function getBlogReadTime({ title, excerpt, content }: Pick<Blog, 'title' | 'excerpt' | 'content'>) {
  const contentText = content.content?.map(getTextFromNode).join(' ') ?? '';
  const words = `${title} ${excerpt ?? ''} ${contentText}`.trim().split(/\s+/).filter(Boolean).length;

  return `${Math.max(4, Math.ceil(words / 180))} min read`;
}
