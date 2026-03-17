import type { LucideIcon } from 'lucide-react';
import { Home, User, Lock, Mail, LayoutDashboard, Settings, Users, Building2, FileText, BarChart3 } from 'lucide-react';

/**
 * Route configuration
 */
export interface RouteConfig {
  href: string;
  label: string;
  icon?: LucideIcon;
  children?: RouteConfig[];
}

/**
 * Public routes
 */
export const publicRoutes: RouteConfig[] = [
  {
    href: '/',
    label: 'Home',
    icon: Home,
  },
];

/**
 * Auth routes
 */
export const authRoutes: RouteConfig[] = [
  {
    href: '/auth/login',
    label: 'Login',
    icon: Lock,
  },
  {
    href: '/auth/signup',
    label: 'Sign Up',
    icon: User,
  },
  {
    href: '/auth/forgot-password',
    label: 'Forgot Password',
    icon: Mail,
  },
  {
    href: '/auth/reset-password',
    label: 'Reset Password',
  },
  {
    href: '/auth/callback',
    label: 'Auth Callback',
  },
  {
    href: '/auth/confirm',
    label: 'Confirm Email',
  },
];

/**
 * Dashboard routes
 */
export const dashboardRoutes: RouteConfig[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/dashboard/profile',
    label: 'Profile',
    icon: User,
  },
];

/**
 * Admin routes
 */
export const adminRoutes: RouteConfig[] = [
  {
    href: '/admin',
    label: 'Admin',
    icon: Settings,
    children: [
      {
        href: '/admin',
        label: 'Overview',
        icon: BarChart3,
      },
      {
        href: '/admin/profile',
        label: 'Profile',
        icon: User,
      },
      {
        href: '/admin/users',
        label: 'Users',
        icon: Users,
      },
      {
        href: '/admin/properties',
        label: 'Properties',
        icon: Building2,
      },
      {
        href: '/admin/reports',
        label: 'Reports',
        icon: FileText,
      },
    ],
  },
];

/**
 * All routes
 */
export const allRoutes: RouteConfig[] = [...publicRoutes, ...authRoutes, ...dashboardRoutes, ...adminRoutes];
