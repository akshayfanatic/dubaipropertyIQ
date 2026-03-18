'use client';

import { usePathname } from 'next/navigation';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

// Breadcrumb mapping for admin routes
const breadcrumbMap: Record<string, string> = {
  '/dashboard/admin': 'Dashboard',
  '/dashboard/admin/properties': 'Properties',
  '/dashboard/admin/users': 'Users',
  '/dashboard/admin/analytics': 'Analytics',
  '/dashboard/admin/settings': 'Settings',
  '/dashboard/admin/profile': 'Profile',
};

export function AdminBreadcrumb() {
  const pathname = usePathname();

  // Generate breadcrumbs from pathname
  const pathSegments = pathname.split('/').filter(Boolean);
  const breadcrumbs: { href: string; label: string }[] = [];

  let currentPath = '';
  pathSegments.forEach((segment) => {
    currentPath += `/${segment}`;
    const label = breadcrumbMap[currentPath] || segment.charAt(0).toUpperCase() + segment.slice(1);
    breadcrumbs.push({ href: currentPath, label });
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="/dashboard/admin">Admin</BreadcrumbLink>
        </BreadcrumbItem>
        {breadcrumbs.slice(1).map((crumb, idx, arr) => (
          <span key={crumb.href} className="contents">
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              {idx === arr.length - 1 ? (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={crumb.href} className="hidden md:block">
                  {crumb.label}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </span>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
