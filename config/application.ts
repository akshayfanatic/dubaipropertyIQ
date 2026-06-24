import type { BadgeVariant } from '@/components/ui/badge';
import { PARTNER_APPLICATION_STATUSES, PARTNER_APPLICATION_STATUS_LABELS, PARTNER_TARGET_ROLE_LABELS, type PartnerApplicationStatus } from '@/types/partner-application';

export const PARTNER_APPLICATION_STATUS_BADGE_VARIANTS: Record<PartnerApplicationStatus, BadgeVariant> = {
  pending: 'secondary',
  reviewing: 'outline',
  approved: 'default',
  rejected: 'destructive',
};

export const PARTNER_APPLICATION_STATUS_OPTIONS = PARTNER_APPLICATION_STATUSES.map((status) => ({
  label: PARTNER_APPLICATION_STATUS_LABELS[status],
  value: status,
}));

export const PARTNER_APPLICATION_STATUS_FILTER_OPTIONS = [{ label: 'All Statuses', value: 'all' }, ...PARTNER_APPLICATION_STATUS_OPTIONS];

export { PARTNER_APPLICATION_STATUS_LABELS, PARTNER_TARGET_ROLE_LABELS };
