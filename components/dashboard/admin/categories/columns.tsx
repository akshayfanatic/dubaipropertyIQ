'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Category, UNCATEGORIZED_CATEGORY_ID } from '@/types/category';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { deleteCategory } from '@/lib/db/categories/actions';
import { toast } from 'sonner';

export const columns: ColumnDef<Category>[] = [
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
    cell: ({ row }) => <span className="text-muted-foreground line-clamp-2 max-w-[300px]">{(row.getValue('description') as string | undefined) || '-'}</span>,
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => {
      const category = row.original;
      return <RowActions category={category} />;
    },
  },
];

function RowActions({ category }: { category: Category }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  // Don't show actions for Uncategorized category
  const isUncategorized = category.id === UNCATEGORIZED_CATEGORY_ID;
  if (isUncategorized) {
    return null;
  }

  const handleEdit = () => {
    router.push(`/dashboard/admin/categories/${category.id}`);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this category? Properties assigned to this category will be moved to "Uncategorized".')) return;

    setIsDeleting(true);
    try {
      const result = await deleteCategory(category.id);

      if (!result?.success) {
        toast.error(result?.message || 'Failed to delete category');
        return;
      }

      toast.success('Category deleted successfully');
      router.refresh();
    } catch {
      toast.error('An unexpected error occurred');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
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
        <DropdownMenuItem onClick={handleDelete} disabled={isDeleting} className="cursor-pointer text-destructive focus:text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
