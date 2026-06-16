'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Blog } from '@/types/blog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Pencil, Eye, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { useActionState, useState, startTransition } from 'react';
import { deleteBlog } from '@/lib/db/blogs/actions';
import { toast } from 'sonner';
import { ConfirmDeleteDialog } from '@/components/shared/confirm-delete-dialog';

export const columns: ColumnDef<Blog>[] = [
  {
    accessorKey: 'feature_image_url',
    header: 'Image',
    cell: ({ row }) => (
      <ImageWithFallback
        src={row.original.feature_image_url?.url}
        alt={row.original.feature_image_url?.alt_tag || row.original.title}
        width={48}
        height={32}
        className="h-8 w-12 rounded object-cover"
        unoptimized
      />
    ),
  },
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => <span className="font-medium">{row.getValue('title')}</span>,
  },
  {
    accessorKey: 'slug',
    header: 'Slug',
    cell: ({ row }) => <code className="rounded bg-muted px-2 py-1 text-xs">/blogs/{row.getValue('slug')}</code>,
  },
  {
    accessorKey: 'blog_categories',
    header: 'Category',
    cell: ({ row }) => {
      const category = row.original.blog_categories;
      return category ? <Badge variant="outline">{category.name}</Badge> : <span className="text-muted-foreground">-</span>;
    },
  },
  {
    accessorKey: 'is_published',
    header: 'Status',
    cell: ({ row }) => {
      const published = row.getValue('is_published') as boolean;
      return published ? <Badge variant="default">Published</Badge> : <Badge variant="secondary">Draft</Badge>;
    },
  },

  {
    id: 'actions',
    header: '',
    cell: ({ row }) => <RowActions blog={row.original} />,
  },
];

type DeleteState = {
  success: boolean;
  error: string | null;
} | null;

const initialState: DeleteState = null;

function RowActions({ blog }: { blog: Blog }) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [, dispatchDelete, isPending] = useActionState(async () => {
    const result = await deleteBlog(blog.id);

    if (!result?.success) {
      toast.error(result?.message || 'Failed to delete blog');
      return { success: false, error: result?.message || 'Failed' };
    }

    toast.success('Blog deleted successfully');
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
          <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => router.push(`/dashboard/admin/blogs/${blog.id}`)} className="cursor-pointer">
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href={`/blogs/${blog.slug}`} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
              <Eye className="mr-2 h-4 w-4" />
              View
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDeleteDialogOpen(true)} disabled={isPending} className="cursor-pointer text-destructive focus:text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDeleteDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} onConfirm={handleDelete} title="Delete Blog" itemName={blog.title} isDeleting={isPending} />
    </>
  );
}
