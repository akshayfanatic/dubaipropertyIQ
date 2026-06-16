'use client';

import { startTransition, useActionState, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { BlogTag } from '@/types/blog-tag';
import { deleteBlogTag } from '@/lib/db/blog-tags/actions';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ConfirmDeleteDialog } from '@/components/shared/confirm-delete-dialog';

export const columns: ColumnDef<BlogTag>[] = [
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
    id: 'actions',
    header: '',
    cell: ({ row }) => <RowActions tag={row.original} />,
  },
];

type DeleteState = {
  success: boolean;
  error: string | null;
} | null;

const initialState: DeleteState = null;

function RowActions({ tag }: { tag: BlogTag }) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [, dispatchDelete, isPending] = useActionState(async () => {
    const result = await deleteBlogTag(tag.id);

    if (!result?.success) {
      toast.error(result?.message || 'Failed to delete blog tag');
      return { success: false, error: result?.message || 'Failed' };
    }

    toast.success('Blog tag deleted successfully');
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
          <DropdownMenuItem onClick={() => router.push(`/dashboard/admin/blog-tags/${tag.id}`)} className="cursor-pointer">
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
        title="Delete Blog Tag"
        itemName={tag.name}
        description="This tag will be removed from any linked blog posts."
        isDeleting={isPending}
      />
    </>
  );
}
