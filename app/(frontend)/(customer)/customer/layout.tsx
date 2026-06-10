import type { Metadata } from 'next';
import { requireAuth } from '@/lib/auth/guards';
import { CustomerAccountShell } from '@/components/customer/CustomerAccountShell';
import React from 'react';
import { noIndexMetadata } from '@/lib/utils/seo';

export const metadata: Metadata = {
  title: 'Customer Account',
  ...noIndexMetadata,
};

const CustomerLayout = async ({ children }: React.PropsWithChildren) => {
  await requireAuth();

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <CustomerAccountShell>{children}</CustomerAccountShell>
      </div>
    </main>
  );
};

export default CustomerLayout;
