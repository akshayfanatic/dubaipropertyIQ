import { TableSkeleton } from '@/components/ui/table-skeleton';

export default function PagesLoading() {
  return <TableSkeleton columns={4} rows={10} />;
}
