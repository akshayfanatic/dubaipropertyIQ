'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { CheckCircle2, Circle, CircleX, Crown, Eye, MoreHorizontal, PhoneCall } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { startTransition, useActionState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { updateLeadStatusAdmin } from '@/lib/db/leads/actions';
import { formatDistanceToNow } from '@/lib/utils/date';
import { LEAD_STATUSES, type Lead, type LeadStatus } from '@/types/lead';

const sourceLabels: Record<string, string> = {
  newsletter: 'Newsletter',
  property: 'Property',
  developer: 'Developer',
  area: 'Area',
  calculator: 'Calculator',
  golden_visa: 'Golden Visa',
  callback: 'Callback',
  whatsapp: 'WhatsApp',
  blog: 'Blog',
  pdf_download: 'PDF Download',
};

const statusVariants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  new: 'default',
  contacted: 'secondary',
  qualified: 'outline',
  converted: 'default',
  dead: 'destructive',
};

const statusIcons = {
  new: Circle,
  contacted: PhoneCall,
  qualified: CheckCircle2,
  converted: Crown,
  dead: CircleX,
} satisfies Record<LeadStatus, React.ComponentType<{ className?: string }>>;

function formatSource(source: string) {
  return sourceLabels[source] || source.replaceAll('_', ' ');
}

export const columns: ColumnDef<Lead>[] = [
  {
    accessorKey: 'name',
    header: 'Lead',
    cell: ({ row }) => (
      <div className="min-w-52">
        <p className="font-medium text-foreground">{row.original.name}</p>
        <p className="text-sm text-muted-foreground">{row.original.email}</p>
        {row.original.phone && <p className="text-sm text-muted-foreground">{row.original.phone}</p>}
      </div>
    ),
  },
  {
    accessorKey: 'source_type',
    header: 'Source',
    cell: ({ row }) => (
      <div className="space-y-1">
        <Badge variant="outline">{formatSource(row.original.source_type)}</Badge>
        {row.original.area_of_interest && <p className="max-w-56 truncate text-xs text-muted-foreground">{row.original.area_of_interest}</p>}
      </div>
    ),
  },
  {
    accessorKey: 'message',
    header: 'Message',
    cell: ({ row }) => {
      const message = row.original.message;
      return message ? <p className="max-w-80 whitespace-pre-line text-sm text-muted-foreground line-clamp-3">{message}</p> : <span className="text-sm text-muted-foreground">-</span>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge variant={statusVariants[status] || 'secondary'} className="capitalize">
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Created',
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{formatDistanceToNow(new Date(row.original.created_at))}</span>,
  },
  {
    id: 'actions',
    header: 'Action',
    cell: ({ row }) => <RowActions lead={row.original} />,
  },
];

type ActionState = {
  success: boolean;
  error: string | null;
} | null;

const initialState: ActionState = null;

function RowActions({ lead }: { lead: Lead }) {
  const router = useRouter();
  const [, dispatchStatus, isPending] = useActionState(async (_state: ActionState, status: LeadStatus) => {
    const result = await updateLeadStatusAdmin(lead.id, status);

    if (!result.success) {
      toast.error(result.message || 'Failed to update lead');
      return { success: false, error: result.message || 'Failed' };
    }

    toast.success('Lead status updated');
    router.refresh();
    return { success: true, error: null };
  }, initialState);

  const updateStatus = (status: LeadStatus) => {
    startTransition(() => dispatchStatus(status));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer" disabled={isPending}>
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => router.push(`/dashboard/admin/leads/${lead.id}`)} className="cursor-pointer">
          <Eye className="mr-2 h-4 w-4" />
          View
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Set status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {LEAD_STATUSES.map((status) => {
          const Icon = statusIcons[status];

          return (
            <DropdownMenuItem key={status} disabled={isPending || lead.status === status} onClick={() => updateStatus(status)} className="cursor-pointer capitalize">
              <Icon className="mr-2 h-4 w-4" />
              {status}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
