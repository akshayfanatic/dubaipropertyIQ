// components/ui/empty-state.tsx
import { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

/**
 * A Resubale Component For No Item Found
 * @example 
 *    <EmptyState
        icon={<Building2 className="h-8 w-8 text-muted-foreground" />}
        title="No properties found"
        description="Try adjusting your filters or add a new property."
        action={
          <Button className="cursor-pointer">
            <Plus className="mr-2 h-4 w-4" />
            Add Property
          </Button>
        }
      />
    );
 * @returns 
 */
export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex min-h-100 flex-col items-center justify-center rounded-xl border border-border/60 bg-card p-8 text-center">
      {icon && <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">{icon}</div>}

      <h3 className="mb-1 text-lg font-semibold">{title}</h3>

      {description && <p className="mb-4 text-muted-foreground">{description}</p>}

      {action && action}
    </div>
  );
}
