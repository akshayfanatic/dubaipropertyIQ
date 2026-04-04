'use client';

import { ColumnDef } from '@tanstack/react-table';
import { PropertyListItem } from '@/types/property';
import { Category } from '@/types/category';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { deleteProperty } from '@/lib/db/properties/actions';
import { toast } from 'sonner';
import { ConfirmDeleteDialog } from '@/components/shared/confirm-delete-dialog';
import { formatPrice, formatSize } from '@/lib/utils/price';

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  available: 'default',
  sold: 'destructive',
  reserved: 'secondary',
  off_plan: 'outline',
};

export const columns: ColumnDef<PropertyListItem>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => <span className="font-medium">{row.getValue('title')}</span>,
  },
  {
    accessorKey: 'category',
    header: 'Type',
    cell: ({ row }) => <span>{(row.getValue('category') as Category)?.name}</span>,
  },
  {
    accessorKey: 'bedrooms',
    header: 'Beds',
  },
  {
    accessorKey: 'price_aed',
    header: 'Price',
    cell: ({ row }) => <span className="tabular-nums">{formatPrice(row.getValue('price_aed'))}</span>,
  },
  {
    accessorKey: 'size_sqft',
    header: 'Size (sqft)',
    cell: ({ row }) => <span className="tabular-nums">{formatSize(row.getValue('size_sqft'))}</span>,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return <Badge variant={statusVariant[status] || 'default'}>{status.replace('_', ' ')}</Badge>;
    },
  },
  {
    accessorKey: 'golden_visa_eligible',
    header: 'Golden Visa',
    cell: ({ row }) => <span className={row.getValue('golden_visa_eligible') ? 'text-green-600' : 'text-muted-foreground'}>{row.getValue('golden_visa_eligible') ? 'Yes' : 'No'}</span>,
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => {
      const property = row.original;
      return <RowActions property={property} />;
    },
  },
];

function RowActions({ property }: { property: PropertyListItem }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleEdit = () => {
    router.push(`/dashboard/admin/properties/${property.id}`);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteProperty(property.id);

      if (!result?.success) {
        toast.error(result?.message || 'Failed to delete property');
        return;
      }

      toast.success('Property deleted successfully');
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
      <ConfirmDeleteDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} onConfirm={handleDelete} title="Delete Property ?" itemName={property.title} isDeleting={isDeleting} />
    </>
  );
}
