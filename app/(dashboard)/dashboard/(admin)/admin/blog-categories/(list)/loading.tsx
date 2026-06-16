import { TableSkeleton } from '@/components/ui/table-skeleton';

export default function BlogCategoriesLoading() {
  return <TableSkeleton columns={4} rows={10} />;
}
