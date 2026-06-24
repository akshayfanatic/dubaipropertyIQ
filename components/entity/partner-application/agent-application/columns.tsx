'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { Eye, MoreHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { PARTNER_APPLICATION_STATUS_BADGE_VARIANTS, PARTNER_APPLICATION_STATUS_LABELS } from '@/config/application';
import { formatDistanceToNow } from '@/lib/utils/date';
import type { PartnerApplicationWithAgentDetails } from '@/types/partner-application';

export const columns: ColumnDef<PartnerApplicationWithAgentDetails>[] = [
  {
    accessorKey: 'full_name',
    header: 'Applicant',
    cell: ({ row }) => (
      <div className="min-w-56">
        <p className="font-medium text-foreground">{row.original.full_name}</p>
        <p className="text-sm text-muted-foreground">{row.original.email}</p>
        {row.original.phone && <p className="text-sm text-muted-foreground">{row.original.phone}</p>}
      </div>
    ),
  },
  {
    accessorKey: 'rera_number',
    header: 'RERA',
    cell: ({ row }) => <span className="text-sm font-medium">{row.original.agent_details?.rera_number || '-'}</span>,
  },
  {
    accessorKey: 'agency_name',
    header: 'Agency',
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.agent_details?.agency_name || '-'}</span>,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <Badge variant={PARTNER_APPLICATION_STATUS_BADGE_VARIANTS[row.original.status]}>{PARTNER_APPLICATION_STATUS_LABELS[row.original.status]}</Badge>,
  },
  {
    accessorKey: 'created_at',
    header: 'Created',
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{formatDistanceToNow(new Date(row.original.created_at))}</span>,
  },
  {
    id: 'actions',
    header: 'Action',
    cell: ({ row }) => <RowActions application={row.original} />,
  },
];

function RowActions({ application }: { application: PartnerApplicationWithAgentDetails }) {
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
        <DropdownMenuItem onClick={() => router.push(`/dashboard/admin/applications/${application.id}`)} className="cursor-pointer">
          <Eye className="mr-2 h-4 w-4" />
          View
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
