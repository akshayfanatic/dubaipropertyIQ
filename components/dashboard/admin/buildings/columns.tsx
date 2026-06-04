'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ConfirmDeleteDialog } from '@/components/shared/confirm-delete-dialog';
import { deleteBuilding } from '@/lib/db/buildings/actions';
import type { BuildingWithRelations } from '@/types/building';

export const columns: ColumnDef<BuildingWithRelations>[] = [
  {
    accessorKey: 'name',
    header: 'Building',
    cell: ({ row }) => (
      <div className="min-w-0">
        <div className="font-medium">{row.original.name}</div>
        <code className="text-xs text-muted-foreground">{row.original.slug}</code>
      </div>
    ),
  },
  {
    accessorKey: 'area',
    header: 'Area',
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.area?.name || '-'}</span>,
  },
  {
    accessorKey: 'developer',
    header: 'Developer',
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.developer?.name || '-'}</span>,
  },
  {
    accessorKey: 'rental_yield',
    header: 'Yield',
    cell: ({ row }) => <span>{row.original.rental_yield != null ? `${row.original.rental_yield}%` : '-'}</span>,
  },
  {
    accessorKey: 'overall_score',
    header: 'Score',
    cell: ({ row }) => (row.original.overall_score != null ? <Badge variant="secondary">{row.original.overall_score}/100</Badge> : <span className="text-muted-foreground">-</span>),
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => <RowActions building={row.original} />,
  },
];

function RowActions({ building }: { building: BuildingWithRelations }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteBuilding(building.id);

      if (!result?.success) {
        toast.error(result?.message || 'Failed to delete building');
        return;
      }

      toast.success('Building deleted successfully');
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
          <DropdownMenuItem onClick={() => router.push(`/dashboard/admin/buildings/${building.id}`)} className="cursor-pointer">
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDeleteDialogOpen(true)} disabled={isDeleting} className="cursor-pointer text-destructive focus:text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDeleteDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} onConfirm={handleDelete} title="Delete Building" itemName={building.name} isDeleting={isDeleting} />
    </>
  );
}
