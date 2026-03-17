import { requireAuth } from '@/lib/auth/guards';
import React from 'react';

const CustomerLayout = async ({ children }: React.PropsWithChildren) => {
  await requireAuth();
  return <div>Layout :{children}</div>;
};

export default CustomerLayout;
