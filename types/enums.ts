import { Constants, type Enums } from './db/supabase-generated';
import type { SelectOption } from './shared';

export type PropertyStatus = Enums<'property_status_enum'>;

export const PROPERTY_STATUSES = Constants.public.Enums.property_status_enum;

export const PROPERTY_STATUS_LABELS: Record<PropertyStatus, string> = {
  available: 'Available',
  sold: 'Sold',
  reserved: 'Reserved',
  off_plan: 'Off Plan',
  draft: 'Draft',
};

export const PROPERTY_STATUS_OPTIONS: SelectOption[] = PROPERTY_STATUSES.map((status) => ({
  label: PROPERTY_STATUS_LABELS[status],
  value: status,
}));

export const ALL_PROPERTY_STATUSES_VALUE = 'all';

export const PROPERTY_STATUS_FILTER_OPTIONS: SelectOption[] = [{ label: 'All Statuses', value: ALL_PROPERTY_STATUSES_VALUE }, ...PROPERTY_STATUS_OPTIONS];

export function isPropertyStatus(status: string | null | undefined): status is PropertyStatus {
  return PROPERTY_STATUSES.includes(status as PropertyStatus);
}

export function parsePropertyStatus(status: string | null | undefined): PropertyStatus | undefined {
  return isPropertyStatus(status) ? status : undefined;
}
