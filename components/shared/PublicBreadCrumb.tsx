'use client';

import { usePathname } from 'next/navigation';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Home } from 'lucide-react';
import Link from 'next/link';

// Breadcrumb mapping for admin routes
const breadcrumbMap: Record<string, string> = {
  '/pages/privacy-policy': 'Privacy Policy',
  '/search': 'Properties Rent For Dubai',
  '/dashboard/admin/users': 'Users',
  '/dashboard/admin/analytics': 'Analytics',
  '/dashboard/admin/settings': 'Settings',
  '/dashboard/admin/profile': 'Profile',
};

export function PublicBreadCrumb() {
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
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={'/'}>
              <Home size={18} />
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {breadcrumbs.slice(1).map((crumb, idx, arr) => (
          <span key={crumb.href} className="contents">
            <BreadcrumbSeparator className=" md:block" />
            <BreadcrumbItem>
              {idx === arr.length - 1 ? (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild className=" md:block">
                  <Link href={crumb.href}>{crumb.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </span>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
