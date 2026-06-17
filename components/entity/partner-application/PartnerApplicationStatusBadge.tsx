import { Badge } from '@/components/ui/badge';
import { PARTNER_APPLICATION_STATUS_BADGE_VARIANTS, PARTNER_APPLICATION_STATUS_LABELS, PARTNER_TARGET_ROLE_LABELS } from '@/config/application';
import { formatDate, formatDistanceToNow } from '@/lib/utils/date';
import type { PartnerApplicationStatus, PartnerTargetRole } from '@/types/partner-application';

interface PartnerApplicationStatusBadgeProps {
  status: PartnerApplicationStatus;
  createdAt?: string;
  role?: PartnerTargetRole;
  submittedPrefix?: string;
}

export function PartnerApplicationStatusBadge({ status, createdAt, role, submittedPrefix }: PartnerApplicationStatusBadgeProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Badge variant={PARTNER_APPLICATION_STATUS_BADGE_VARIANTS[status]}>{PARTNER_APPLICATION_STATUS_LABELS[status]}</Badge>
      {role && <Badge variant="outline">{PARTNER_TARGET_ROLE_LABELS[role]}</Badge>}
      {createdAt && (
        <span className="text-sm text-muted-foreground">
          {submittedPrefix ? `${submittedPrefix} ` : ''}
          {formatDistanceToNow(new Date(createdAt))} · {formatDate(new Date(createdAt))}
        </span>
      )}
    </div>
  );
}
