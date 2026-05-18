'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { ArrowLeft, Home } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

// Breadcrumb mapping for admin routes
const breadcrumbMap: Record<string, string> = {
  '/pages/privacy-policy': 'Privacy Policy',
  '/search': 'Properties Rent For Dubai',
  '/dashboard/admin/users': 'Users',
  '/dashboard/admin/analytics': 'Analytics',
  '/dashboard/admin/settings': 'Settings',
  '/dashboard/admin/profile': 'Profile',
};

type PublicBreadCrumbProps = {
  enableBackButton?: boolean;
};

/**
 *
 *  @param  enableBackButton Enbling Back Button defualt value false
 * @returns
 */
export function PublicBreadCrumb({ enableBackButton = true }: PublicBreadCrumbProps) {
  const pathname = usePathname();
  const router = useRouter();

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
    <div className="flex items-center gap-2 mb-2">
      {enableBackButton && (
        <>
          <button onClick={() => router.back()} className="flex items-center gap-1.5 pr-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer group">
            <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
            Back
          </button>
          <div className="h-4 w-px bg-border/60 mx-1" />
        </>
      )}

      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/" className="hover:text-primary transition-colors">
                <Home size={16} className="mb-0.5" />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          {breadcrumbs.slice(1).map((crumb, idx, arr) => (
            <React.Fragment key={crumb.href}>
              <BreadcrumbSeparator className="opacity-50" />
              <BreadcrumbItem>
                {idx === arr.length - 1 ? (
                  <BreadcrumbPage className="font-semibold text-foreground max-w-[150px] sm:max-w-[300px] truncate">{crumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={crumb.href} className="hover:text-primary transition-colors">
                      {crumb.label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
