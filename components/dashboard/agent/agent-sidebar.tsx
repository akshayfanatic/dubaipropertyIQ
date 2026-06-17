'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, LogOut } from 'lucide-react';
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
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { agentRoutes } from '@/config/routes';
import { cn } from '@/lib/utils';

export function AgentSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/dashboard/agent') {
      return pathname === '/dashboard/agent' || pathname === '/dashboard/agent/';
    }

    return pathname.startsWith(href);
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="group/logo">
              <Link href="/dashboard/agent">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground transition-all duration-200 group-hover/logo:scale-105">
                  <Building2 className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Dubai Property IQ</span>
                  <span className="truncate text-xs text-muted-foreground">Agent Portal</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {agentRoutes.map((group, groupIndex) => (
          <div key={group.title}>
            <SidebarGroup>
              <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item, index) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);

                    return (
                      <SidebarMenuItem key={item.href} className="animate-in fade-in slide-in-from-left-2" style={{ animationDelay: `${index * 35}ms`, animationFillMode: 'backwards' }}>
                        <SidebarMenuButton
                          asChild
                          isActive={active}
                          tooltip={item.title}
                          className={cn(
                            'relative transition-all duration-200',
                            item.isComingSoon && 'cursor-not-allowed opacity-60',
                            active && 'bg-primary! text-secondary! before:absolute before:left-0 before:top-1/2 before:h-5 before:w-1 before:-translate-y-1/2 before:rounded-r-full before:bg-primary',
                          )}
                        >
                          <Link href={item.isComingSoon ? '#' : item.href} onClick={item.isComingSoon ? (event) => event.preventDefault() : undefined}>
                            <Icon />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                        {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
                        {item.isComingSoon && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md border border-sidebar-border/50 bg-sidebar-accent px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-sidebar-accent-foreground/70 group-data-[collapsible=icon]:pointer-events-none group-data-[collapsible=icon]:opacity-0">
                                Soon
                              </span>
                            </TooltipTrigger>
                            <TooltipContent side="right">Coming soon</TooltipContent>
                          </Tooltip>
                        )}
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            {groupIndex < agentRoutes.length - 1 && <SidebarSeparator />}
          </div>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <form action={logout}>
              <SidebarMenuButton tooltip="Logout" className="w-full cursor-pointer text-destructive transition-all duration-200 hover:text-destructive">
                <LogOut className="text-destructive" />
                <span>Logout</span>
              </SidebarMenuButton>
            </form>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
