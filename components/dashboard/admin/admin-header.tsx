'use client';

import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { AdminBreadcrumb } from './admin-breadcrumb';
import { ProfileDropdown } from './profile-dropdown';
import { UserProfile } from '@/types/user';

interface AdminHeaderProps {
  user?: UserProfile | null;
}

export function AdminHeader({ user }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <AdminBreadcrumb />
      <div className="ml-auto flex items-center gap-2">
        <ProfileDropdown user={user} />
      </div>
    </header>
  );
}
