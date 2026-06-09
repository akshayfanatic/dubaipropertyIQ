'use client';

import { LayoutDashboard, User } from 'lucide-react';
import { ProfileDropdown } from '@/components/dashboard/admin/profile-dropdown';
import { AccountMenuList } from './account-menu-list';
import { useAuth } from '@/providers/auth-provider';

export function AdminNav() {
  const { user } = useAuth();

  return (
    <>
      {/* Desktop: Dropdown Menu */}
      <div className="hidden md:block">
        <ProfileDropdown />
      </div>

      {/* Mobile: Direct account list */}
      <div className="md:hidden">
        <AccountMenuList
          user={user}
          fallbackName="Admin"
          badge="Admin"
          items={[
            { label: 'Dashboard', href: '/dashboard/admin', icon: LayoutDashboard },
            { label: 'Profile', href: '/dashboard/admin/profile', icon: User },
          ]}
          avatarClassName="ring-primary"
          fallbackClassName="bg-primary text-primary-foreground"
        />
      </div>
    </>
  );
}
