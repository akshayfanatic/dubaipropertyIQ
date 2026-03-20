import type { LucideIcon } from 'lucide-react';
import { Home, User, Lock, LayoutDashboard, Settings, Users, Building2, BarChart3, FileStack, MapPin, Briefcase } from 'lucide-react';

// ============================================
// Types
// ============================================

export type BadgeVariant = 'default' | 'success' | 'warning' | 'destructive' | 'outline' | 'secondary';

export interface RouteItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
  badgeVariant?: BadgeVariant;
  isComingSoon?: boolean;
  children?: RouteItem[];
}

export interface RouteGroup {
  title: string;
  items: RouteItem[];
}

// ============================================
// Public Routes
// ============================================

export const publicRoutes: RouteItem[] = [
  { title: 'Home', href: '/', icon: Home },
  { title: 'Login', href: '/auth/login', icon: Lock },
  { title: 'Sign Up', href: '/auth/signup', icon: User },
];

// ============================================
// Admin Dashboard Routes
// ============================================

export const adminRoutes: RouteGroup[] = [
  {
    title: 'Overview',
    items: [{ title: 'Dashboard', href: '/dashboard/admin', icon: LayoutDashboard }],
  },
  {
    title: 'Management',
    items: [
      { title: 'Properties', href: '/dashboard/admin/properties', icon: Building2 },
      { title: 'Users', href: '/dashboard/admin/users', icon: Users, isComingSoon: true },
      { title: 'Leads', href: '/dashboard/admin/leads', icon: FileStack, isComingSoon: true, badge: '12' },
      { title: 'Areas', href: '/dashboard/admin/areas', icon: MapPin, isComingSoon: true },
      { title: 'Developers', href: '/dashboard/admin/developers', icon: Briefcase, isComingSoon: true },
    ],
  },
  {
    title: 'Analytics',
    items: [{ title: 'Reports', href: '/dashboard/admin/analytics', icon: BarChart3, isComingSoon: true }],
  },
  {
    title: 'System',
    items: [
      { title: 'Settings', href: '/dashboard/admin/settings', icon: Settings, isComingSoon: true },
      { title: 'Profile', href: '/dashboard/admin/profile', icon: User },
    ],
  },
];

// ============================================
// Agent Dashboard Routes
// ============================================

export const agentRoutes: RouteGroup[] = [
  {
    title: 'Overview',
    items: [{ title: 'Dashboard', href: '/dashboard/agent', icon: LayoutDashboard, isComingSoon: true }],
  },
  {
    title: 'Listings',
    items: [
      { title: 'My Properties', href: '/dashboard/agent/properties', icon: Building2, isComingSoon: true },
      { title: 'Profile', href: '/dashboard/agent/profile', icon: User, isComingSoon: true },
    ],
  },
];
