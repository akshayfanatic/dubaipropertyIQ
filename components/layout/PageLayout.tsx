import { cn } from '@/lib/utils';

type PageProps = {
  breadcrumb?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentFullWidth?: boolean;
};

const PageLayout = ({ breadcrumb, children, className, contentFullWidth = false }: PageProps) => {
  return (
    <div className="py-8">
      {/* Breadcrumb always container */}
      {breadcrumb && <div className="container mx-auto px-8 mb-6">{breadcrumb}</div>}

      {/* Content conditional */}
      <div className={cn(contentFullWidth ? 'w-full' : 'container mx-auto px-8', className)}>{children}</div>
    </div>
  );
};

export default PageLayout;
