import { Skeleton } from '@/components/ui/skeleton';

export default function EditBlogCategoryLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-96 w-full rounded-lg" />
    </div>
  );
}
