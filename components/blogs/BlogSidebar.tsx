import type { ReactNode } from 'react';

type BlogSidebarProps = {
  children: ReactNode;
};

type BlogSidebarCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  variant?: 'default' | 'highlight';
  children: ReactNode;
};

export function BlogSidebar({ children }: BlogSidebarProps) {
  return <aside className="grid gap-4 lg:sticky lg:top-44 lg:self-start">{children}</aside>;
}

export function BlogSidebarCard({ eyebrow, title, description, variant = 'default', children }: BlogSidebarCardProps) {
  const isHighlight = variant === 'highlight';

  return (
    <div
      className={
        isHighlight
          ? 'overflow-hidden rounded-2xl border border-primary-foreground/20 bg-[linear-gradient(135deg,oklch(0.20_0.12_260.47),oklch(0.31_0.14_260.47))] p-5 text-primary-foreground shadow-md'
          : 'rounded-2xl border border-border bg-card p-5 shadow-sm'
      }
    >
      <span
        className={
          isHighlight
            ? "inline-flex items-center gap-2 text-[0.7rem] font-extrabold uppercase tracking-[0.15em] text-primary-foreground/80 before:h-0.5 before:w-5.5 before:rounded-full before:bg-primary-foreground/70 before:content-['']"
            : "inline-flex items-center gap-2 text-[0.7rem] font-extrabold uppercase tracking-[0.15em] text-primary before:h-0.5 before:w-5.5 before:rounded-full before:bg-primary before:content-['']"
        }
      >
        {eyebrow}
      </span>
      <h3 className={isHighlight ? 'mt-3 text-lg font-extrabold leading-tight text-primary-foreground' : 'mt-3 text-lg font-extrabold leading-tight text-foreground'}>{title}</h3>
      <p className={isHighlight ? 'mt-2 text-sm font-medium leading-6 text-primary-foreground/75' : 'mt-2 text-sm font-medium leading-6 text-muted-foreground'}>{description}</p>
      <div className={isHighlight ? 'mt-4 rounded-xl bg-background/96 p-3 text-foreground shadow-sm' : 'mt-4 grid gap-2'}>{children}</div>
    </div>
  );
}
