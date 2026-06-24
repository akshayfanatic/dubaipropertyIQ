import { AlertCircle, FileText } from 'lucide-react';
import { BlogGuidesSection } from '@/components/home/BlogGuidesSection';
import { EmptyState } from '@/components/shared/no-item-found';
import { JsonLd } from '@/components/shared/JsonLd';
import { Skeleton } from '@/components/ui/skeleton';
import { getBlogs } from '@/lib/db/blogs/queries';
import { createBlogsCollectionSchema, createBreadcrumbSchema } from '@/lib/utils/structured-data';
import type { BlogFilters } from '@/types/blog';

export type BlogResultsParams = {
  category_id?: string;
  tag_ids?: string | string[];
};

function normalizeTagIds(tagIds?: string | string[]) {
  const values = Array.isArray(tagIds) ? tagIds : tagIds?.split(',');
  const normalized = values?.map((value) => value.trim()).filter(Boolean);

  return normalized ?? [];
}

function BlogResultsShell({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold leading-tight text-foreground">Latest Dubai property guides</h2>
      </div>
      {children}
    </div>
  );
}

export async function BlogResults({ params }: { params: BlogResultsParams }) {
  const tagIds = normalizeTagIds(params.tag_ids);
  const filters: BlogFilters = {
    category_id: params.category_id || undefined,
    tag_ids: tagIds.length ? tagIds : undefined,
  };
  const result = await getBlogs(filters);

  if (!result.success || !result.data) {
    return (
      <BlogResultsShell>
        <EmptyState icon={<AlertCircle className="h-8 w-8 text-muted-foreground" />} title="Unable to load guides" description="Please try again later." />
      </BlogResultsShell>
    );
  }

  if (result.data.length === 0) {
    return (
      <BlogResultsShell>
        <EmptyState icon={<FileText className="h-8 w-8 text-muted-foreground" />} title="No guides found" description="Try another category or tag." />
      </BlogResultsShell>
    );
  }

  return (
    <BlogResultsShell>
      <BlogGuidesSection blogs={result.data} gridClassName="md:grid-cols-2" />
      <JsonLd
        id="blogs-structured-data"
        data={[
          createBlogsCollectionSchema(result.data),
          createBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Dubai Property Guides', path: '/blogs' },
          ]),
        ]}
      />
    </BlogResultsShell>
  );
}

function BlogGuideCardSkeleton() {
  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
      <Skeleton className="h-45 rounded-none" />
      <div className="space-y-4 p-5">
        <div className="flex gap-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-4/5" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <Skeleton className="h-5 w-24" />
      </div>
    </article>
  );
}

export function BlogResultsSkeleton() {
  return (
    <BlogResultsShell>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <BlogGuideCardSkeleton key={index} />
        ))}
      </div>
    </BlogResultsShell>
  );
}
