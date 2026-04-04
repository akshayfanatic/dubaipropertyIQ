'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { deleteArea } from '@/lib/db/areas/actions';
import { toast } from 'sonner';
import { ConfirmDeleteDialog } from '@/components/shared/confirm-delete-dialog';

interface AreaWithCity {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  photos: string[];
  city_id: string;
  cities: {
    name: string;
    slug: string;
  } | null;
}

export const columns: ColumnDef<AreaWithCity>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => <span className="font-medium">{row.getValue('name')}</span>,
  },
  {
    accessorKey: 'cities',
    header: 'City',
    cell: ({ row }) => {
      const city = row.getValue('cities') as { name: string } | null;
      return <span className="text-muted-foreground">{city?.name || '-'}</span>;
    },
  },
  {
    accessorKey: 'slug',
    header: 'Slug',
    cell: ({ row }) => <code className="rounded bg-muted px-2 py-1 text-xs">{row.getValue('slug')}</code>,
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => <span className="text-muted-foreground line-clamp-2 max-w-75">{(row.getValue('description') as string | undefined) || '-'}</span>,
  },
  {
    accessorKey: 'photos',
    header: 'Photos',
    cell: ({ row }) => {
      const photos = row.getValue('photos') as string[];
      return <span className="text-muted-foreground">{photos.length || 0} photos</span>;
    },
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => {
      const area = row.original;
      return <RowActions area={area} />;
    },
  },
];

function RowActions({ area }: { area: AreaWithCity }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleEdit = () => {
    router.push(`/dashboard/admin/areas/${area.id}`);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteArea(area.id);

      if (!result?.success) {
        toast.error(result?.message || 'Failed to delete area');
        return;
      }

      toast.success('Area deleted successfully');
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
          <DropdownMenuItem onClick={() => setDeleteDialogOpen(true)} disabled={isDeleting} className="cursor-pointer text-destructive focus:text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDeleteDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} onConfirm={handleDelete} title="Delete Area" itemName={area.name} isDeleting={isDeleting} />
    </>
  );
}
