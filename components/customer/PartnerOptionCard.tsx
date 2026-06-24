'use client';

import Link from 'next/link';
import { ArrowRight, BriefcaseBusiness, Building2, CheckCircle2, LockKeyhole } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';

type PartnerOptionIcon = 'agent' | 'developer';

const partnerOptionIcons = {
  agent: BriefcaseBusiness,
  developer: Building2,
} satisfies Record<PartnerOptionIcon, typeof BriefcaseBusiness>;

interface PartnerOptionCardProps {
  title: string;
  eyebrow: string;
  description: string;
  href: string;
  icon: PartnerOptionIcon;
  bestFor: string;
  requirements: readonly string[];
  animationDelay?: string;
}

export function PartnerOptionCard({ title, eyebrow, description, href, icon, bestFor, requirements, animationDelay }: PartnerOptionCardProps) {
  const { user, loading } = useAuth();
  const Icon = partnerOptionIcons[icon];
  const targetHref = user ? href : `/auth/login?redirectTo=${encodeURIComponent(href)}`;

  return (
    <Link
      href={targetHref}
      aria-disabled={loading}
      style={{ animationDelay, animationFillMode: 'backwards' }}
      className="group flex h-full flex-col rounded-xl border border-border/70 bg-card/70 p-4 shadow-sm shadow-foreground/5 transition-all duration-200 animate-in fade-in slide-in-from-bottom-4 hover:-translate-y-0.5 hover:border-primary/25 hover:bg-card hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 motion-reduce:animate-none sm:p-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/[0.08] text-primary ring-1 ring-primary/10">
          <Icon className="h-5 w-5" />
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted/70 text-muted-foreground transition-all duration-200 group-hover:bg-primary group-hover:text-primary-foreground">
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </div>
      </div>

      <div className="mt-4 min-w-0 sm:mt-5">
        <p className="text-xs font-medium uppercase leading-4 text-muted-foreground">{eyebrow}</p>
        <h3 className="mt-2 text-lg font-semibold tracking-normal text-foreground">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-lg bg-primary/[0.04] px-3 py-2 text-sm leading-5 text-foreground sm:mt-5">
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <span>{bestFor}</span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 sm:mt-4">
        {requirements.map((requirement) => (
          <span key={requirement} className="inline-flex min-h-8 items-center gap-1.5 rounded-md border border-border/70 bg-background/70 px-2.5 text-xs font-medium text-muted-foreground">
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-primary" />
            <span>{requirement}</span>
          </span>
        ))}
      </div>

      {!loading && !user && (
        <div className="mt-auto pt-4">
          <span className="inline-flex min-h-7 items-center gap-1 rounded-md border bg-muted px-2 text-xs font-medium text-muted-foreground">
            <LockKeyhole className="h-3.5 w-3.5" />
            Login required
          </span>
        </div>
      )}
    </Link>
  );
}
