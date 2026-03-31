'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Developer } from '@/types/developer';
import { calculateTrustScore, getTrustScoreLabel } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { deleteDeveloper } from '@/lib/db/developers/actions';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Building2 } from 'lucide-react';

export const columns: ColumnDef<Developer>[] = [
  {
    accessorKey: 'name',
    header: 'Developer',
    cell: ({ row }) => {
      const developer = row.original;
      return (
        <div className="flex items-center gap-3">
          {developer.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={developer.logo_url} alt={developer.name} className="h-10 w-10 rounded-lg object-contain border" />
          ) : (
            <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center border">
              <Building2 className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
          <div>
            <span className="font-medium">{developer.name}</span>
            <p className="text-xs text-muted-foreground">{developer.years_active} years active</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'slug',
    header: 'Slug',
    cell: ({ row }) => <code className="rounded bg-muted px-2 py-1 text-xs">{row.getValue('slug')}</code>,
  },
  {
    id: 'trust_score',
    header: 'Trust Score',
    cell: ({ row }) => {
      const developer = row.original;
      const score = calculateTrustScore(developer);
      const { label, variant } = getTrustScoreLabel(score);
      return (
        <div className="flex items-center gap-2">
          <span className="font-medium">{score}</span>
          <Badge variant={variant}>{label}</Badge>
        </div>
      );
    },
  },
  {
    id: 'projects',
    header: 'Projects',
    cell: ({ row }) => {
      const developer = row.original;
      return (
        <div className="text-sm">
          <span className="font-medium">{developer.completed_projects}</span>
          <span className="text-muted-foreground">/{developer.total_projects} completed</span>
          {developer.ongoing_projects > 0 && <span className="text-muted-foreground"> ({developer.ongoing_projects} ongoing)</span>}
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => {
      const developer = row.original;
      return <RowActions developer={developer} />;
    },
  },
];

function RowActions({ developer }: { developer: Developer }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = () => {
    router.push(`/dashboard/admin/developers/${developer.id}`);
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${developer.name}"? Properties linked to this developer will be unassigned.`)) return;

    setIsDeleting(true);
    try {
      const result = await deleteDeveloper(developer.id);

      if (!result?.success) {
        toast.error(result?.message || 'Failed to delete developer');
        return;
      }

      toast.success('Developer deleted successfully');
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
