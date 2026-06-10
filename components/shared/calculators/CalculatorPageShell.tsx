import type { ReactNode } from 'react';

type CalculatorPageShellProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function CalculatorPageShell({ title, description, children }: CalculatorPageShellProps) {
  return (
    <section className="py-2 sm:py-4">
      <div className="mx-auto max-w-[1200px]">
        <div className="mx-auto mb-6 max-w-3xl text-center sm:mb-8">
          <h1 className="text-2xl font-bold leading-tight tracking-normal text-foreground sm:text-3xl">{title}</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">{description}</p>
        </div>
        {children}
      </div>
    </section>
  );
}
