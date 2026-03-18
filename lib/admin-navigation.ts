import { LayoutDashboard, Building2, Users, BarChart3, Settings, User, type LucideIcon } from 'lucide-react';

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const adminNavGroups: NavGroup[] = [
  {
    title: 'Overview',
    items: [
      {
        title: 'Dashboard',
        href: '/dashboard/admin',
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: 'Management',
    items: [
      {
        title: 'Properties',
        href: '/dashboard/admin/properties',
        icon: Building2,
      },
      {
        title: 'Users',
        href: '/dashboard/admin/users',
        icon: Users,
      },
    ],
  },
  {
    title: 'Analytics',
    items: [
      {
        title: 'Reports',
        href: '/dashboard/admin/analytics',
        icon: BarChart3,
      },
    ],
  },
  {
    title: 'System',
    items: [
      {
        title: 'Settings',
        href: '/dashboard/admin/settings',
        icon: Settings,
      },
    ],
  },
];

export const adminSecondaryNav: NavItem[] = [
  {
    title: 'Profile',
    href: '/dashboard/admin/profile',
    icon: User,
  },
];
