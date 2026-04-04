'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Amenity } from '@/types/amenities';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { deleteAmenity } from '@/lib/db/amenities/actions';
import { toast } from 'sonner';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';

export const columns: ColumnDef<Amenity>[] = [
  {
    accessorKey: 'logo_url',
    header: 'Logo',
    cell: ({ row }) => {
      const logoUrl = row.getValue('logo_url') as { url: string; alt_tag: string } | null;
      const amenityName = row.getValue('name') as string;
      return (
        <div className="size-10">
          <ImageWithFallback
            src={logoUrl?.url}
            alt={logoUrl?.alt_tag || amenityName || 'Amenity'}
            width={32}
            height={32}
            className="rounded-sm object-cover"
            fallbackClassName="rounded-sm"
            useInitials={!logoUrl?.url}
          />
        </div>
      );
    },
  },
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
    cell: ({ row }) => <span className="text-muted-foreground line-clamp-2 max-w-75">{(row.getValue('description') as string | undefined) || '-'}</span>,
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => {
      const amenity = row.original;
      return <RowActions amenity={amenity} />;
    },
  },
];

function RowActions({ amenity }: { amenity: Amenity }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = () => {
    router.push(`/dashboard/admin/amenities/${amenity.id}`);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this amenity?')) return;

    setIsDeleting(true);
    try {
      const result = await deleteAmenity(amenity.id);

      if (!result?.success) {
        toast.error(result?.message || 'Failed to delete amenity');
        return;
      }

      toast.success('Amenity deleted successfully');
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
