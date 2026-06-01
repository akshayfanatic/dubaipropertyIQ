'use client';

import { ArrowRight, Mail, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function NewsletterSection() {
  return (
    <section className="bg-muted/45 py-[clamp(3.5rem,7vw,6.5rem)]">
      <div className="mx-auto w-[min(92%,1440px)]">
        <div className="card-entrance overflow-hidden rounded-3xl border border-border bg-background shadow-lg shadow-foreground/8">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_420px]">
            <div className="p-6 sm:p-8 lg:p-10">
              <span className="inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-primary before:h-0.5 before:w-5.5 before:rounded-full before:bg-primary before:content-['']">
                Market signal
              </span>
              <h2 className="mt-4 max-w-2xl text-[clamp(1.75rem,3vw,2.55rem)] font-extrabold leading-tight tracking-normal text-foreground">One useful Dubai property brief each week.</h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
                Short notes on areas, developers, price movement, and buyer tools. Written for people comparing real options, not browsing headlines.
              </p>

              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck className="size-4 text-primary" />
                  Curated signals
                </span>
                <span className="inline-flex items-center gap-2">
                  <Mail className="size-4 text-primary" />
                  No lead-gen spam
                </span>
              </div>
            </div>

            <div className="border-t border-border bg-primary/8 p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
              <form className="grid gap-3" onSubmit={(event) => event.preventDefault()}>
                <label htmlFor="home-newsletter-email" className="text-sm font-bold text-foreground">
                  Email address
                </label>
                <input
                  id="home-newsletter-email"
                  type="email"
                  aria-label="Email"
                  placeholder="you@example.com"
                  className="h-12 min-w-0 rounded-xl border border-border bg-background px-4 text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/35"
                />
                <Button type="submit" className="h-12 justify-between rounded-xl px-4 font-bold">
                  Send weekly insights
                  <ArrowRight className="size-4" />
                </Button>
                <p className="text-xs leading-5 text-muted-foreground">Unsubscribe anytime. No broker lists, no paid placements.</p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
