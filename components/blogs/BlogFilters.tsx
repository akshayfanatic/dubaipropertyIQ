import { BlogCategoryFilter } from '@/components/blogs/filter/BlogCategoryFilter';
import { BlogTagFilter } from '@/components/blogs/filter/BlogTagFilter';

export function BlogFilters() {
  return (
    <div className="grid gap-3 py-3">
      <BlogCategoryFilter />
      <BlogTagFilter />
    </div>
  );
}
