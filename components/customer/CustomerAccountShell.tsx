'use client';

import type { ReactNode } from 'react';

import { CustomerAccountAvatar } from '@/components/customer/CustomerAccountAvatar';
import { CustomerAccountNav } from '@/components/customer/CustomerAccountNav';

interface CustomerAccountShellProps {
  children: ReactNode;
}

export function CustomerAccountShell({ children }: CustomerAccountShellProps) {
  return (
    <div className="mx-auto min-w-0 space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">My Account</h1>
        <p className="text-muted-foreground">Manage your profile and saved property shortlist.</p>
      </div>

      <div className="grid min-w-0 gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
        <aside className="min-w-0 overflow-hidden rounded-xl border border-border bg-card p-3 shadow-sm lg:sticky lg:top-6" aria-label="Customer account navigation">
          <CustomerAccountAvatar />
          <CustomerAccountNav />
        </aside>

        <section className="min-w-0 space-y-4">{children}</section>
      </div>
    </div>
  );
}
