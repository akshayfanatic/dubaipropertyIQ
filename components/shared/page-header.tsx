import { Plus } from 'lucide-react';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { BackButton } from '@/components/ui/back-button';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  showBackButton?: boolean;
  action?: {
    label: string;
    href: string;
    icon?: React.ReactNode;
  };
}

export function PageHeader({ title, description, showBackButton, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        {showBackButton && <BackButton />}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
      </div>
      {action && (
        <Link className={cn(buttonVariants({ variant: 'default' }), 'w-fit')} href={action.href}>
          {action.icon ?? <Plus className="mr-2 h-4 w-4" />}
          {action.label}
        </Link>
      )}
    </div>
  );
}
