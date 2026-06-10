import type { ReactNode } from 'react';

type CalculatorPageShellProps = {
  eyebrow?: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function CalculatorPageShell({ eyebrow = 'Dubai property tool', title, description, children }: CalculatorPageShellProps) {
  return (
    <section className="py-2 sm:py-4">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-6 max-w-3xl text-left sm:mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">{eyebrow}</p>
          <h1 className="mt-2 text-2xl font-bold leading-tight tracking-normal text-foreground sm:text-3xl">{title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">{description}</p>
        </div>
        {children}
      </div>
    </section>
  );
}
