'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Page } from '@/types/page';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Pencil, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export const columns: ColumnDef<Page>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => <span className="font-medium">{row.getValue('title')}</span>,
  },
  {
    accessorKey: 'slug',
    header: 'Slug',
    cell: ({ row }) => <code className="rounded bg-muted px-2 py-1 text-xs">/{row.getValue('slug')}</code>,
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
    cell: ({ row }) => <RowActions page={row.original} />,
  },
];

function RowActions({ page }: { page: Page }) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => router.push(`/dashboard/admin/pages/${page.id}`)} className="cursor-pointer">
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={`/pages/${page.slug}`} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
            <Eye className="mr-2 h-4 w-4" />
            View
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
