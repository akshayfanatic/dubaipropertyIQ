import { TableSkeleton } from '@/components/ui/table-skeleton';

export default function AreasLoading() {
  return <TableSkeleton columns={5} rows={10} />;
}
