import { Users } from 'lucide-react';
import { EmptyState } from '@/components/shared/no-item-found';
import { getUsersAdmin } from '@/lib/db/users/queries';
import { DataTable } from '@/components/ui/data-table';
import { Pagination } from '@/components/shared/pagination';
import { columns } from './columns';
import type { UserWithRole } from '@/types/user-admin';

interface UsersListProps {
  filters: {
    search?: string;
    role?: string;
    page?: number;
    pageSize?: number;
  };
}

export async function UsersList({ filters }: UsersListProps) {
  const result = await getUsersAdmin();

  if (!result.success || !result.data) {
    throw new Error(result.message || 'Failed to fetch users');
  }

  const filtered = result.data.filter((user: UserWithRole) => {
    if (user.deleted_at) return false;
    if (filters.search && !user.email?.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.role && filters.role !== 'all' && user.role !== filters.role) return false;
    return true;
  });

  // Client-side pagination
  const page = filters.page || 1;
  const pageSize = filters.pageSize || 10;
  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const paginatedUsers = filtered.slice(start, start + pageSize);

  if (paginatedUsers.length === 0) {
    return (
      <EmptyState
        icon={<Users className="h-8 w-8 text-muted-foreground" />}
        title="No users found"
        description={filters.search || (filters.role && filters.role !== 'all') ? 'Try adjusting your filters.' : 'Users will appear here when they register.'}
      />
    );
  }

  return (
    <div className="space-y-4">
      <DataTable columns={columns} data={paginatedUsers} />
      <Pagination total={total} page={page} pageSize={pageSize} />
    </div>
  );
}
