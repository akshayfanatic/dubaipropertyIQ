import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface WidgetCardProps {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  children: React.ReactNode;
  className?: string;
  contentClassNames?: string;
}

export function WidgetCard({ icon: Icon, title, description, variant = 'default', children, className, contentClassNames }: WidgetCardProps) {
  const isDestructive = variant === 'destructive';
  const hasHeader = Icon || title || description;

  return (
    <Card className={cn(isDestructive && 'border-destructive/30', className)}>
      {hasHeader && (
        <CardHeader>
          <div className="flex items-center gap-3">
            {Icon && (
              <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', isDestructive ? 'bg-destructive/10' : 'bg-primary/10')}>
                <Icon className={cn('h-5 w-5', isDestructive ? 'text-destructive' : 'text-primary')} />
              </div>
            )}
            <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-2">
              {title && <CardTitle className={cn(isDestructive && 'text-destructive')}>{title}</CardTitle>}
              {description && <CardDescription>{description}</CardDescription>}
            </div>
          </div>
        </CardHeader>
      )}
      <CardContent className={cn(!hasHeader && 'px-6 pt-6', contentClassNames)}>{children}</CardContent>
    </Card>
  );
}
