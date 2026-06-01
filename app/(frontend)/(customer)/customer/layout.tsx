import { requireAuth } from '@/lib/auth/guards';
import React from 'react';

const CustomerLayout = async ({ children }: React.PropsWithChildren) => {
  await requireAuth();

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</div>
    </main>
  );
};

export default CustomerLayout;
