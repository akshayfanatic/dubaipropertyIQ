import Link from 'next/link';
import { ArrowRight, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToolCardProps = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  ringColor: string;
};

export function ToolCard({ title, description, href, icon: Icon, iconBg, iconColor, ringColor }: ToolCardProps) {
  return (
    <Link href={href} className="group relative block">
      <div
        className={cn(
          'relative overflow-hidden rounded-2xl border border-border/50 bg-card p-8 transition-all duration-300',
          'hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1',
          'ring-2 ring-transparent hover:ring-4 w-full',
          ringColor,
        )}
      >
        <div className="absolute inset-0 bg-primary opacity-0 transition-opacity duration-300 group-hover:opacity-[0.03]" />

        <div className={cn('relative w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm', iconBg)}>
          <Icon className={cn('w-8 h-8', iconColor)} strokeWidth={1.5} />
        </div>

        <h3 className="relative font-semibold text-xl mb-3 text-foreground group-hover:text-primary transition-colors duration-200">{title}</h3>

        <p className="relative text-sm text-muted-foreground leading-relaxed mb-6 line-clamp-2">{description}</p>

        <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary-foreground px-5 py-2.5 rounded-full transition-all duration-200 shadow-md hover:shadow-lg bg-primary hover:bg-primary/90">
          Try Now
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
        </div>
      </div>
    </Link>
  );
}
