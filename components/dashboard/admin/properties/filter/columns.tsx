'use client';

import { ColumnDef } from '@tanstack/react-table';
import { PropertyListItem } from '@/types/property';
import { Category } from '@/types/category';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { deleteProperty, updateProperty } from '@/lib/db/properties/actions';
import { toast } from 'sonner';
import { ConfirmDeleteDialog } from '@/components/shared/confirm-delete-dialog';
import { formatPrice, formatSize } from '@/lib/utils/price';
import { PROPERTY_STATUS_LABELS, PROPERTY_STATUS_OPTIONS, type PropertyStatus } from '@/types/enums';
import { cn } from '@/lib/utils';
import { SelectField } from '@/components/shared/select-field';

const statusSelectClassName: Record<PropertyStatus, string> = {
  available: 'border-primary/30 bg-primary/10 text-primary hover:bg-primary/15',
  sold: 'border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/15',
  reserved: 'border-dashboard-status-warning/30 bg-dashboard-status-warning/10 text-dashboard-status-warning hover:bg-dashboard-status-warning/15',
  off_plan: 'border-dashboard-status-info/30 bg-dashboard-status-info/10 text-dashboard-status-info hover:bg-dashboard-status-info/15',
  draft: 'border-muted-foreground/25 bg-muted text-muted-foreground hover:bg-muted/80',
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
      return <StatusSelect property={row.original} />;
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

function StatusSelect({ property }: { property: PropertyListItem }) {
  const router = useRouter();
  const [status, setStatus] = useState<PropertyStatus>(property.status);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (nextStatus: string) => {
    const propertyStatus = nextStatus as PropertyStatus;

    if (propertyStatus === status || isUpdating) {
      return;
    }

    const previousStatus = status;
    setStatus(propertyStatus);
    setIsUpdating(true);

    try {
      const result = await updateProperty(property.id, { status: propertyStatus });

      if (!result?.success) {
        setStatus(previousStatus);
        toast.error(result?.message || 'Failed to update property status');
        return;
      }

      toast.success(`Property status changed to ${PROPERTY_STATUS_LABELS[propertyStatus]}`);
      router.refresh();
    } catch {
      setStatus(previousStatus);
      toast.error('An unexpected error occurred');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <SelectField
      options={PROPERTY_STATUS_OPTIONS}
      value={status}
      onValueChange={handleStatusChange}
      disabled={isUpdating}
      className={cn('h-8 w-36 cursor-pointer text-sm font-medium transition-colors [&>svg]:opacity-70', statusSelectClassName[status])}
    />
  );
}

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
