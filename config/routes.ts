import type { LucideIcon } from 'lucide-react';
import { Home, User, Lock, LayoutDashboard, Settings, Users, Building2, FileStack, MapPin, Briefcase, Layers, FileText, Newspaper, FolderOpen, Tags, BriefcaseBusiness } from 'lucide-react';

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
      {
        title: 'Properties',
        href: '/dashboard/admin/properties',
        icon: Building2,
        children: [
          { title: 'All Properties', href: '/dashboard/admin/properties', icon: Building2 },
          { title: 'Categories', href: '/dashboard/admin/categories', icon: Layers },
        ],
      },
      {
        title: 'Areas',
        href: '/dashboard/admin/areas',
        icon: MapPin,
        children: [
          { title: 'All Areas', href: '/dashboard/admin/areas', icon: MapPin },
          { title: 'Buildings', href: '/dashboard/admin/buildings', icon: Building2 },
        ],
      },
      { title: 'Cities', href: '/dashboard/admin/cities', icon: Building2 },
      { title: 'Developers', href: '/dashboard/admin/developers', icon: Briefcase },
      { title: 'Amenities', href: '/dashboard/admin/amenities', icon: Layers },
    ],
  },
  {
    title: 'Marketing',
    items: [
      { title: 'Pages', href: '/dashboard/admin/pages', icon: FileText },
      {
        title: 'Blogs',
        href: '/dashboard/admin/blogs',
        icon: Newspaper,
        children: [
          { title: 'All Blogs', href: '/dashboard/admin/blogs', icon: Newspaper },
          { title: 'Categories', href: '/dashboard/admin/blog-categories', icon: FolderOpen },
          { title: 'Tags', href: '/dashboard/admin/blog-tags', icon: Tags },
        ],
      },
      { title: 'Leads', href: '/dashboard/admin/leads', icon: FileStack },
    ],
  },
  {
    title: 'Applications',
    items: [{ title: 'Applications', href: '/dashboard/admin/applications', icon: BriefcaseBusiness }],
  },
  {
    title: 'Users',
    items: [{ title: 'Users', href: '/dashboard/admin/users', icon: Users }],
  },
  {
    title: 'System',
    items: [
      { title: 'Settings', href: '/dashboard/admin/settings', icon: Settings },
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
