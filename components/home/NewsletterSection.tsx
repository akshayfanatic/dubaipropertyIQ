import { Mail, ShieldCheck } from 'lucide-react';
import { NewsletterLeadForm } from '@/components/leads/NewsletterLeadForm';

// Newsletter content block; callers can place it inside their own section wrapper.
export function NewsletterContent() {
  return (
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
        <div className="grid gap-3">
          <NewsletterLeadForm />
          <p className="text-xs leading-5 text-muted-foreground">Unsubscribe anytime. No broker lists, no paid placements.</p>
        </div>
      </div>
    </div>
  );
}
