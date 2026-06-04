import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { getLeadByIdAdmin } from '@/lib/db/leads/queries';
import { formatDate, formatDistanceToNow } from '@/lib/utils/date';

interface AdminLeadPageProps {
  params: Promise<{ id: string }>;
}

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

function formatSource(source: string) {
  return sourceLabels[source] || source.replaceAll('_', ' ');
}

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="space-y-1 rounded-lg border bg-card p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="break-words text-sm font-medium text-foreground">{value || '-'}</p>
    </div>
  );
}

export default async function AdminLeadPage({ params }: AdminLeadPageProps) {
  const { id } = await params;
  const { success, data: lead } = await getLeadByIdAdmin(id);

  if (!success || !lead) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader title={lead.name} description="Captured lead details" showBackButton />

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline">{formatSource(lead.source_type)}</Badge>
        <Badge variant={statusVariants[lead.status] || 'secondary'} className="capitalize">
          {lead.status}
        </Badge>
        <span className="text-sm text-muted-foreground">
          {formatDistanceToNow(new Date(lead.created_at))} · {formatDate(new Date(lead.created_at))}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Name" value={lead.name} />
        <Field label="Email" value={lead.email} />
        <Field label="Phone" value={lead.phone} />
        <Field label="Nationality" value={lead.nationality} />
        <Field label="Source Page" value={lead.source_page} />
        <Field label="Area / Interest" value={lead.area_of_interest} />
        <Field label="UTM Source" value={lead.utm_source} />
        <Field label="UTM Medium" value={lead.utm_medium} />
        <Field label="UTM Campaign" value={lead.utm_campaign} />
      </div>

      <div className="space-y-2 rounded-lg border bg-card p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Message</p>
        <p className="whitespace-pre-line text-sm leading-6 text-foreground">{lead.message || '-'}</p>
      </div>
    </div>
  );
}
