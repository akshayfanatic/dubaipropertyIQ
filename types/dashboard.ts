// types/dashboard.ts

/**
 * Dashboard statistics for overview page
 */
export interface DashboardStats {
  properties: number;
  areas: number;
  developers: number;
  users: number;
}

/**
 * Quick action button configuration
 */
export interface QuickAction {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}
