'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, LogOut, ChevronRight, ChevronDown } from 'lucide-react';
import { logout } from '@/app/(auth)/auth/actions';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarMenuBadge,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { adminRoutes } from '@/config/routes';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useState } from 'react';
import { useClient } from '@/hooks/use-client';

// Animation delay generator for staggered animations
const getAnimationDelay = (index: number): string => `${index * 30}ms`;

export function AdminSidebar() {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const isClient = useClient();
  const { state } = useSidebar();

  const isActive = (href: string) => {
    if (href === '/dashboard/admin') {
      return pathname === '/dashboard/admin' || pathname === '/dashboard/admin/';
    }
    return pathname.startsWith(href);
  };

  const toggleExpanded = (href: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(href)) {
        newSet.delete(href);
      } else {
        newSet.add(href);
      }
      return newSet;
    });
  };

  const isExpanded = (href: string) => {
    return expandedItems.has(href);
  };

  return (
    <Sidebar collapsible="icon">
      {/* Header with Logo */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="group/logo transition-all duration-300 hover:scale-[1.02]">
              <Link href="/dashboard/admin">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground transition-all duration-300 group-hover/logo:scale-110 group-hover/logo:shadow-md">
                  <Building2 className="size-4 transition-transform duration-300 group-hover/logo:rotate-12" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold transition-colors duration-200 group-hover/logo:text-sidebar-primary">Dubai Property IQ</span>
                  <span className="truncate text-xs text-muted-foreground">Admin Panel</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Main Navigation */}
      <SidebarContent>
        {adminRoutes.map((group, groupIndex) => (
          <div key={group.title}>
            <SidebarGroup>
              <SidebarGroupLabel className="transition-all duration-300 ease-in-out">{group.title}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="sidebar-group-items">
                  {group.items.map((item, itemIndex) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    const hasChildren = item.children && item.children.length > 0;
                    const expanded = isExpanded(item.href);
                    const hasActiveChild = item.children?.some((child) => isActive(child.href));

                    return (
                      <SidebarMenuItem key={item.href} className="animate-in fade-in slide-in-from-left-2" style={{ animationDelay: getAnimationDelay(itemIndex), animationFillMode: 'backwards' }}>
                        {hasChildren ? (
                          // Accordion item with children
                          <>
                            {/* PARENT ITEM WHEN COLLAPSE */}
                            {state === 'collapsed' ? (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Link
                                    href={item.href}
                                    className={cn(
                                      'flex items-center justify-center w-full px-2 py-1.5 rounded-md transition-all duration-200 ease-out hover:bg-accent overflow-hidden',
                                      'group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2! group-data-[collapsible=icon]:size-8!',
                                      (active || hasActiveChild) && 'bg-accent',
                                      (active || hasActiveChild) &&
                                        'before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-5 before:bg-primary before:rounded-r-full before:animate-in before:slide-in-from-left-full relative',
                                    )}
                                  >
                                    <Icon className="h-4 w-4 shrink-0 transition-transform duration-200" />
                                  </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right" align="center">
                                  {item.title}
                                </TooltipContent>
                              </Tooltip>
                            ) : (
                              <>
                                {/*PARENT WITH CHILDREN */}
                                <div
                                  className={cn(
                                    'flex items-center justify-between w-full px-2 py-1.5 rounded-md transition-all duration-200 ease-out cursor-pointer hover:bg-primary hover:text-secondary overflow-hidden',
                                    (active || hasActiveChild) && 'bg-primary text-secondary hover:text-white dark:text-white',
                                    (active || hasActiveChild) &&
                                      'before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-5 before:bg-primary before:rounded-r-full before:animate-in before:slide-in-from-left-full relative',
                                  )}
                                  onClick={() => toggleExpanded(item.href)}
                                >
                                  <Icon className="h-4 w-4 shrink-0 transition-transform duration-200" />
                                  <span className="ml-2 text-sm font-medium truncate">{item.title}</span>
                                  <span className="ml-auto flex items-center">
                                    {isClient &&
                                      (expanded ? <ChevronDown className="h-3 w-3 transition-transform duration-200" /> : <ChevronRight className="h-3 w-3 transition-transform duration-200" />)}
                                    {!isClient && <ChevronRight className="h-3 w-3" />}
                                  </span>
                                </div>
                              </>
                            )}

                            {expanded && item.children && (
                              <SidebarMenuSub>
                                {item.children.map((child) => {
                                  const ChildIcon = child.icon;
                                  const childActive = isActive(child.href);
                                  return (
                                    <SidebarMenuSubItem key={child.href}>
                                      <SidebarMenuSubButton asChild isActive={childActive}>
                                        {/* MENU CHILDREN ITEMS */}
                                        <Link
                                          className={`${childActive && 'before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-5 before:bg-primary before:rounded-r-full before:animate-in before:slide-in-from-left-full relative bg-primary text-secondary hover:text-white dark:text-white '}`}
                                          href={child.isComingSoon ? '#' : child.href}
                                          onClick={child.isComingSoon ? (e) => e.preventDefault() : undefined}
                                        >
                                          <ChildIcon className="h-4 w-4" />
                                          <span>{child.title}</span>
                                        </Link>
                                      </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                  );
                                })}
                              </SidebarMenuSub>
                            )}
                          </>
                        ) : (
                          // Regular item without children
                          <>
                            <SidebarMenuButton
                              asChild
                              isActive={active}
                              tooltip={item.title}
                              className={cn(
                                'relative transition-all duration-200 ease-out',
                                item.isComingSoon && 'cursor-not-allowed opacity-60',
                                active &&
                                  'before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-5 before:bg-primary before:rounded-r-full before:animate-in before:slide-in-from-left-full bg-primary! text-secondary! dark:text-white!',
                              )}
                            >
                              <Link href={item.isComingSoon ? '#' : item.href} onClick={item.isComingSoon ? (e) => e.preventDefault() : undefined}>
                                <Icon className="transition-transform duration-200 group-hover/menu-button:scale-110" />
                                <span>{item.title}</span>
                              </Link>
                            </SidebarMenuButton>
                            {item.badge && <SidebarMenuBadge className="animate-pulse animate-infinite fade-in zoom-in duration-200 ">{item.badge}</SidebarMenuBadge>}
                            {item.isComingSoon && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase text-sidebar-accent-foreground/70 bg-sidebar-accent rounded-md border border-sidebar-border/50 transition-opacity duration-200 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:pointer-events-none">
                                    Soon
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent side="right" className="text-xs">
                                  This feature is coming soon
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </>
                        )}
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            {groupIndex < adminRoutes.length - 1 && <SidebarSeparator className="animate-in fade-in duration-300" />}
          </div>
        ))}
      </SidebarContent>

      {/* Footer with Logout */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <form action={logout}>
              <SidebarMenuButton tooltip="Logout" className="w-full cursor-pointer text-destructive transition-all duration-200 hover:scale-[1.02] hover:text-destructive active:scale-[0.98]">
                <LogOut className="text-destructive transition-transform duration-200 group-hover/menu-button:-translate-x-0.5" />
                <span>Logout</span>
              </SidebarMenuButton>
            </form>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
