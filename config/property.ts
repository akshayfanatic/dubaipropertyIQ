import { PROPERTY_STATUS_LABELS, type PropertyStatus } from '@/types/enums';

// Shared property UI config. Keep status badge labels/styles here so cards,
// detail pages, and future property surfaces do not duplicate enum styling.
export interface PropertyStatusBadgeConfig {
  label: string;
  className: string;
}

export const PROPERTY_STATUS_BADGE_CLASS_NAMES: Record<PropertyStatus, string> = {
  available: 'bg-primary/95 text-primary-foreground backdrop-blur-sm',
  sold: 'bg-muted/90 text-muted-foreground backdrop-blur-sm',
  reserved: 'bg-accent/90 text-accent-foreground backdrop-blur-sm',
  off_plan: 'bg-secondary/90 text-secondary-foreground backdrop-blur-sm',
  draft: 'bg-muted/90 text-muted-foreground backdrop-blur-sm',
};

export const PROPERTY_STATUS_BADGE_CONFIG: Record<PropertyStatus, PropertyStatusBadgeConfig> = {
  available: {
    label: PROPERTY_STATUS_LABELS.available,
    className: PROPERTY_STATUS_BADGE_CLASS_NAMES.available,
  },
  sold: {
    label: PROPERTY_STATUS_LABELS.sold,
    className: PROPERTY_STATUS_BADGE_CLASS_NAMES.sold,
  },
  reserved: {
    label: PROPERTY_STATUS_LABELS.reserved,
    className: PROPERTY_STATUS_BADGE_CLASS_NAMES.reserved,
  },
  off_plan: {
    label: PROPERTY_STATUS_LABELS.off_plan,
    className: PROPERTY_STATUS_BADGE_CLASS_NAMES.off_plan,
  },
  draft: {
    label: PROPERTY_STATUS_LABELS.draft,
    className: PROPERTY_STATUS_BADGE_CLASS_NAMES.draft,
  },
};

export function getPropertyStatusBadgeConfig(status: PropertyStatus): PropertyStatusBadgeConfig {
  return PROPERTY_STATUS_BADGE_CONFIG[status];
}
