'use client';

import { ColumnDef } from '@tanstack/react-table';
import type { UserRole, UserWithRole } from '@/types/user-admin';
import { ROLE_OPTIONS } from '@/types/user-admin';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Trash2, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { deleteUserAdmin } from '@/lib/db/users/actions';
import { toast } from 'sonner';
import { ConfirmDeleteDialog } from '@/components/shared/confirm-delete-dialog';
import { formatDistanceToNow } from '@/lib/utils/date';

export const columns: ColumnDef<UserWithRole>[] = [
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => {
      const email = row.getValue('email') as string | null;
      const deleted = row.original.deleted_at;
      return (
        <div className="flex items-center gap-2">
          <span className={deleted ? 'text-muted-foreground' : ''}>{email || 'No email'}</span>
          {deleted && (
            <Badge variant="destructive" className="text-xs">
              Deleted
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => {
      const role = row.getValue('role') as UserRole;
      const option = ROLE_OPTIONS.find((o) => o.value === role);
      return (
        <Badge variant={(option?.color as 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link') || 'secondary'} className="capitalize">
          <Shield className="mr-1 h-3 w-3" />
          {option?.label || role}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Created',
    cell: ({ row }) => {
      const date = row.getValue('created_at') as string;
      return <span className="text-muted-foreground text-sm">{formatDistanceToNow(new Date(date))}</span>;
    },
  },
  {
    accessorKey: 'last_sign_in_at',
    header: 'Last Sign In',
    cell: ({ row }) => {
      const date = row.getValue('last_sign_in_at') as string | null;
      if (!date) return <span className="text-muted-foreground text-sm">Never</span>;
      return <span className="text-muted-foreground text-sm">{formatDistanceToNow(new Date(date))}</span>;
    },
  },
  {
    accessorKey: 'email_confirmed_at',
    header: 'Verified',
    cell: ({ row }) => {
      const confirmed = row.getValue('email_confirmed_at') as string | null;
      return confirmed ? (
        <Badge variant="default" className="text-xs">
          Verified
        </Badge>
      ) : (
        <Badge variant="outline" className="text-xs">
          Pending
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => {
      const user = row.original;
      return <RowActions user={user} />;
    },
  },
];

function RowActions({ user }: { user: UserWithRole }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleEdit = () => {
    router.push(`/dashboard/admin/users/${user.id}`);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteUserAdmin(user.id);

      if (!result?.success) {
        toast.error(result?.message || 'Failed to delete user');
        return;
      }

      toast.success('User deleted successfully');
      setDeleteDialogOpen(false);
      router.refresh();
    } catch {
      toast.error('An unexpected error occurred');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleEdit} className="cursor-pointer">
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          {user.role !== 'admin' && (
            <DropdownMenuItem onClick={() => setDeleteDialogOpen(true)} disabled={isDeleting || !!user.deleted_at} className="cursor-pointer text-destructive focus:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete User"
        itemName={user.email || 'Unknown'}
        description={
          <>
            This will permanently delete the user <strong>{user.email || 'Unknown'}</strong>. All their data will be removed. This action cannot be undone.
          </>
        }
        isDeleting={isDeleting}
      />
    </>
  );
}
