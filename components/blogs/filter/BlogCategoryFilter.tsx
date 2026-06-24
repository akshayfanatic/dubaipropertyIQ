'use client';

import { parseAsString, useQueryState } from 'nuqs';
import useSWR from 'swr';
import { useDebouncedCallback } from 'use-debounce';
import type { BlogCategoryOption } from '@/types/blog-category';

function CategorySkeleton() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, index) => (
        <span key={index} className="h-9 w-32 shrink-0 animate-pulse rounded-full bg-muted" />
      ))}
    </>
  );
}

export function BlogCategoryFilter() {
  const { data: categories = [], isLoading, error } = useSWR<BlogCategoryOption[]>('/api/public/blogs/categories/options');
  const [selectedCategoryId, setSelectedCategoryId] = useQueryState(
    'category_id',
    parseAsString.withDefault('').withOptions({
      shallow: false,
      history: 'replace',
    }),
  );
  const updateQuery = useDebouncedCallback((value: string | null) => {
    setSelectedCategoryId(value);
  }, 300);
  const isAllSelected = !selectedCategoryId;

  function updateCategory(nextCategoryId: string) {
    const value = selectedCategoryId === nextCategoryId ? '' : nextCategoryId;

    updateQuery(value || null);
  }

  function resetCategory() {
    updateQuery(null);
  }

  return (
    <div className="grid gap-2">
      <div className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Blog categories">
        <span className="shrink-0 text-xs font-extrabold uppercase tracking-[0.1em] text-muted-foreground">Categories</span>
        <button
          type="button"
          aria-pressed={isAllSelected}
          onClick={resetCategory}
          className={
            isAllSelected
              ? 'min-h-9 shrink-0 rounded-full border border-primary bg-primary px-4 text-sm font-extrabold text-primary-foreground shadow-sm'
              : 'min-h-9 shrink-0 rounded-full border border-border bg-card px-4 text-sm font-extrabold text-foreground shadow-sm transition-colors hover:border-primary/40 hover:text-primary'
          }
        >
          All guides
        </button>

        {isLoading ? (
          <CategorySkeleton />
        ) : (
          categories.map((category) => {
            const isSelected = selectedCategoryId === category.value;

            return (
              <button
                key={category.value}
                type="button"
                aria-pressed={isSelected}
                onClick={() => updateCategory(category.value)}
                className={
                  isSelected
                    ? 'min-h-9 shrink-0 rounded-full border border-primary bg-primary px-4 text-sm font-extrabold text-primary-foreground shadow-sm'
                    : 'min-h-9 shrink-0 rounded-full border border-border bg-card px-4 text-sm font-extrabold text-foreground shadow-sm transition-colors hover:border-primary/40 hover:text-primary'
                }
              >
                {category.label}
              </button>
            );
          })
        )}
      </div>

      {error && <p className="text-sm font-semibold text-muted-foreground">Categories are temporarily unavailable.</p>}
    </div>
  );
}
