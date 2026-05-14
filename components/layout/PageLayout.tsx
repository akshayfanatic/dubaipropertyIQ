import React from 'react';
import { cn } from '@/lib/utils'; // adjust path

interface PageProps {
  breadcrumb?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

const PageLayout = ({ breadcrumb, children, className }: PageProps) => {
  return (
    <div className={cn('container mx-auto py-8 px-8', className)}>
      {breadcrumb && <div>{breadcrumb}</div>}
      <div>{children}</div>
    </div>
  );
};

export default PageLayout;
