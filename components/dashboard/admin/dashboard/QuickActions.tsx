// components/dashboard/admin/dashboard/QuickActions.tsx

import Link from 'next/link';
import { ArrowRight, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { QuickAction } from '@/types/dashboard';

interface QuickActionsProps {
  actions: QuickAction[];
  className?: string;
}

export function QuickActions({ actions, className }: QuickActionsProps) {
  const shortcutCount = actions.length;

  return (
    <section className={cn('rounded-xl border border-border bg-card p-5 shadow-sm', className)}>
      <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-primary">Command rail</p>
          <h2 className="mt-1 text-lg font-extrabold text-foreground">Quick actions</h2>
        </div>
        <span className="w-fit rounded-full bg-muted px-3 py-1 text-xs font-bold text-muted-foreground">{shortcutCount} shortcuts</span>
      </div>
      {shortcutCount === 0 && (
        <div className="flex min-h-32 items-center gap-3 rounded-xl border border-dashed border-border bg-background px-4 py-5">
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
            <Plus className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-extrabold text-foreground">No quick actions configured</p>
            <p className="mt-1 text-xs font-medium leading-5 text-muted-foreground">Add actions to keep common admin workflows one click away.</p>
          </div>
        </div>
      )}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {actions.map((action, index) => {
          const Icon = action.icon;
          const isPrimary = index === 0;

          return (
            <Link
              key={`${action.href}-${action.title}`}
              href={action.href}
              className={cn(
                'group min-h-36 min-w-0 rounded-xl border p-4 outline-none transition-[border-color,background-color,box-shadow] duration-200 focus-visible:ring-[3px] focus-visible:ring-ring/35',
                isPrimary ? 'border-primary bg-primary text-primary-foreground shadow-sm hover:bg-primary/92' : 'border-border bg-background hover:border-primary/35 hover:bg-accent/45',
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className={cn(
                    'grid size-11 shrink-0 place-items-center rounded-xl transition-transform duration-200 group-hover:-translate-y-0.5',
                    isPrimary ? 'bg-primary-foreground/14 text-primary-foreground' : 'bg-primary/10 text-primary',
                  )}
                >
                  <Icon className="size-5" />
                </span>
                <ArrowRight
                  className={cn(
                    'size-4 transition-transform group-hover:translate-x-0.5',
                    isPrimary ? 'text-primary-foreground/70 group-hover:text-primary-foreground' : 'text-muted-foreground group-hover:text-primary',
                  )}
                />
              </div>
              <p className={cn('mt-4 line-clamp-2 break-words text-sm font-extrabold', isPrimary ? 'text-primary-foreground' : 'text-foreground')}>{action.title}</p>
              <p className={cn('mt-1 line-clamp-2 text-xs font-medium leading-5', isPrimary ? 'text-primary-foreground/76' : 'text-muted-foreground')}>{action.description}</p>
              {action.badge && (
                <span
                  className={cn(
                    'mt-3 inline-flex max-w-full truncate rounded-full px-2 py-0.5 text-[11px] font-extrabold',
                    isPrimary ? 'bg-primary-foreground/16 text-primary-foreground' : 'bg-muted text-muted-foreground',
                  )}
                >
                  {action.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
