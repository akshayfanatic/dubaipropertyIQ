'use client';

import { startTransition, useActionState, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { BlogCategory } from '@/types/blog-category';
import { deleteBlogCategory } from '@/lib/db/blog-categories/actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ConfirmDeleteDialog } from '@/components/shared/confirm-delete-dialog';

export const columns: ColumnDef<BlogCategory>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => <span className="font-medium">{row.getValue('name')}</span>,
  },
  {
    accessorKey: 'slug',
    header: 'Slug',
    cell: ({ row }) => <code className="rounded bg-muted px-2 py-1 text-xs">{row.getValue('slug')}</code>,
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => <span className="line-clamp-2 max-w-75 text-muted-foreground">{(row.getValue('description') as string | undefined) || '-'}</span>,
  },
  {
    accessorKey: 'is_active',
    header: 'Status',
    cell: ({ row }) => <Badge variant={row.getValue('is_active') ? 'default' : 'secondary'}>{row.getValue('is_active') ? 'Active' : 'Inactive'}</Badge>,
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => <RowActions category={row.original} />,
  },
];

type DeleteState = {
  success: boolean;
  error: string | null;
} | null;

const initialState: DeleteState = null;

function RowActions({ category }: { category: BlogCategory }) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [, dispatchDelete, isPending] = useActionState(async () => {
    const result = await deleteBlogCategory(category.id);

    if (!result?.success) {
      toast.error(result?.message || 'Failed to delete blog category');
      return { success: false, error: result?.message || 'Failed' };
    }

    toast.success('Blog category deleted successfully');
    setDeleteDialogOpen(false);
    router.refresh();

    return { success: true, error: null };
  }, initialState);

  const handleDelete = () => {
    startTransition(() => dispatchDelete());
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8 cursor-pointer">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => router.push(`/dashboard/admin/blog-categories/${category.id}`)} className="cursor-pointer">
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDeleteDialogOpen(true)} disabled={isPending} className="cursor-pointer text-destructive focus:text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Blog Category"
        itemName={category.name}
        description="Blogs assigned to this category will keep publishing, but their category will be cleared."
        isDeleting={isPending}
      />
    </>
  );
}
