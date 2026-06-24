'use client';

import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';
import useSWR from 'swr';
import { useDebouncedCallback } from 'use-debounce';
import type { BlogTagOption } from '@/types/blog-tag';

function TagSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index} className="h-8 w-24 shrink-0 animate-pulse rounded-full bg-muted" />
      ))}
    </>
  );
}

export function BlogTagFilter() {
  const { data: tags = [], isLoading, error } = useSWR<BlogTagOption[]>('/api/public/blogs/tags/options');
  const [selectedTagIds, setSelectedTagIds] = useQueryState(
    'tag_ids',
    parseAsArrayOf(parseAsString).withDefault([]).withOptions({
      shallow: false,
      history: 'replace',
    }),
  );
  const updateQuery = useDebouncedCallback((value: string[] | null) => {
    setSelectedTagIds(value);
  }, 300);

  function updateTag(tagId: string) {
    const nextTagIds = selectedTagIds.includes(tagId) ? selectedTagIds.filter((selectedTagId) => selectedTagId !== tagId) : [...selectedTagIds, tagId];

    updateQuery(nextTagIds.length ? nextTagIds : null);
  }

  return (
    <div className="grid gap-2">
      <div className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Blog tags">
        <span className="shrink-0 text-xs font-extrabold uppercase tracking-[0.1em] text-muted-foreground">Tags</span>

        {isLoading ? (
          <TagSkeleton />
        ) : (
          tags.map((tag) => {
            const isSelected = selectedTagIds.includes(tag.value);

            return (
              <button
                key={tag.value}
                type="button"
                aria-pressed={isSelected}
                onClick={() => updateTag(tag.value)}
                className={
                  isSelected
                    ? 'min-h-8 shrink-0 rounded-full border border-primary/45 bg-primary/10 px-3 text-xs font-extrabold text-primary'
                    : 'min-h-8 shrink-0 rounded-full border border-dashed border-border bg-card/80 px-3 text-xs font-extrabold text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary'
                }
              >
                #{tag.label}
              </button>
            );
          })
        )}
      </div>

      {error && <p className="text-sm font-semibold text-muted-foreground">Tags are temporarily unavailable.</p>}
    </div>
  );
}
