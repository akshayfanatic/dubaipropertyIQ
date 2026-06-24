'use client';

import { usePathname } from 'next/navigation';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

const breadcrumbMap: Record<string, string> = {
  '/dashboard/agent': 'Dashboard',
  '/dashboard/agent/properties': 'My Properties',
  '/dashboard/agent/profile': 'Profile',
};

export function AgentBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: { href: string; label: string }[] = [];

  let currentPath = '';
  segments.forEach((segment) => {
    currentPath += `/${segment}`;
    breadcrumbs.push({
      href: currentPath,
      label: breadcrumbMap[currentPath] || segment.charAt(0).toUpperCase() + segment.slice(1),
    });
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="/dashboard/agent">Agent</BreadcrumbLink>
        </BreadcrumbItem>
        {breadcrumbs.slice(1).map((crumb, index, items) => (
          <span key={crumb.href} className="contents">
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              {index === items.length - 1 ? (
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
