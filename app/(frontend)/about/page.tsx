import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BarChart3, Building2, CheckCircle2, Home, Mail, MapPin, Phone, Search } from 'lucide-react';

import { AnimateSection } from '@/components/shared/AnimateSection';
import { Typewriter } from '@/components/shared/Typewriter';
import { buttonVariants } from '@/components/ui/button';
import { getGroupedSettings } from '@/lib/db/settings/queries';
import { cn } from '@/lib/utils';
import { ContactLeadForm } from '@/components/leads/ContactLeadForm';
import { createPageMetadata } from '@/lib/utils/seo';
import { staticImages } from '@/config';

export const metadata: Metadata = createPageMetadata({
  title: 'About Dubai Property IQ',
  description: 'Learn how Dubai Property IQ helps buyers and investors research Dubai properties, communities, developers, and ownership decisions.',
  path: '/about',
  keywords: ['Dubai Property IQ', 'Dubai property research', 'Dubai real estate intelligence'],
  image: staticImages.home.propertyInterior,
});

const principles = [
  {
    icon: Search,
    signal: 'Search clarity',
    title: 'Make search decisive',
    description: 'Clear filters, locations, budgets, and property signals help buyers move from broad discovery to a focused shortlist.',
  },
  {
    icon: Building2,
    signal: 'Context layer',
    title: 'Keep context visible',
    description: 'Developer, area, amenities, Golden Visa, and location information stay close to each property decision.',
  },
  {
    icon: BarChart3,
    signal: 'Investment lens',
    title: 'Support investment thinking',
    description: 'Calculators and market-aware content help users compare affordability, rental tradeoffs, and long-term fit.',
  },
];

const milestones = [
  {
    period: 'Today',
    title: 'Dubai property intelligence platform',
    description: 'Dubai Property IQ brings property search, area research, developer context, calculators, and enquiry flows into one focused experience.',
  },
  {
    period: 'Product focus',
    title: 'Decision tools for buyers and investors',
    description: 'Mortgage and rent-versus-buy calculators help users test affordability before they commit to viewings or enquiries.',
  },
  {
    period: 'Market context',
    title: 'Area and developer research',
    description: 'Community pages, city data, and developer profiles help users understand the environment around each listing.',
  },
  {
    period: 'Customer journey',
    title: 'Property-specific enquiry paths',
    description: 'Contact flows are designed to carry property context into the conversation, so the next step starts with useful detail.',
  },
  {
    period: 'Foundation',
    title: 'Built around clarity and trust',
    description: 'The platform is shaped for serious property decisions: calm UI, structured data, transparent filters, and practical next actions.',
  },
];

function getSettingText(value: unknown, fallback: string) {
  return typeof value === 'string' && value.trim().length > 0 ? value : fallback;
}

export default async function AboutPage() {
  const settingsResponse = await getGroupedSettings();
  const contactSettings = settingsResponse.success ? settingsResponse.data?.contact : undefined;

  const contactItems = [
    {
      icon: MapPin,
      label: 'Dubai, UAE',
      value: getSettingText(contactSettings?.address, 'Built for Dubai property decisions'),
    },
    {
      icon: Phone,
      label: 'Property enquiries',
      value: getSettingText(contactSettings?.phone, '+971 4 123 4567'),
    },
    {
      icon: Mail,
      label: 'Contact',
      value: getSettingText(contactSettings?.email, 'info@dubaipropertyiq.com'),
    },
  ];

  return (
    <main className="bg-background text-foreground">
      {/* Hero */}
      <section className="border-b border-border bg-card">
        <AnimateSection className="container mx-auto grid min-h-[560px] gap-12 px-6 py-16 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-20">
          <div className="flex flex-col justify-between gap-12">
            <div>
              <Link href="/" className="mb-10 inline-flex items-center gap-3 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
                  <Home className="h-4 w-4" />
                </span>
                Dubai Property IQ
              </Link>

              <div className="max-w-xl">
                <p className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-primary">About us</p>
                <h1 className="text-4xl font-bold leading-tight tracking-normal text-foreground md:text-5xl">Better property decisions start with better intelligence.</h1>
                <p className="mt-6 text-base leading-7 text-muted-foreground md:text-lg">
                  Dubai Property IQ helps buyers, investors, and residents research listings, communities, developers, and ownership tradeoffs with less uncertainty.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {contactItems.map((item) => (
                <div key={item.label} className="card-entrance flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-primary/15 bg-primary/10 text-primary">
                    <item.icon className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-foreground">{item.label}</span>
                    <span className="mt-1 block text-sm leading-5 text-muted-foreground">{item.value}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[420px] overflow-hidden rounded-2xl border border-border bg-muted">
            <Image src={staticImages.home.propertyInterior} alt="Dubai property interior" fill priority className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/65 via-foreground/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <div className="card-entrance max-w-md rounded-xl border border-background/40 bg-background/95 p-5 shadow-lg">
                <p className="text-sm font-semibold text-primary">Our mission</p>
                <p className="mt-3 text-xl font-semibold leading-7 text-foreground">Make Dubai property discovery more transparent, comparable, and useful for every serious decision-maker.</p>
              </div>
            </div>
          </div>
        </AnimateSection>
      </section>

      {/* Purpose */}
      <section className="border-b border-border bg-background py-16 md:py-20">
        <AnimateSection className="container mx-auto px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">What we build for</p>
              <h2 className="mt-4 min-h-[7.5rem] text-3xl font-bold leading-tight tracking-normal text-foreground md:min-h-[5.5rem]">
                <Typewriter loop text="From browsing listings to knowing what fits." speed={45} delay={200} />
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {principles.map((item, index) => (
                <div
                  key={item.title}
                  className="card-entrance group relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"
                >
                  <span className="absolute left-0 top-0 h-1 w-full bg-primary/70" />
                  <span className="absolute right-4 top-4 text-5xl font-bold leading-none text-primary/[0.06]">{String(index + 1).padStart(2, '0')}</span>

                  <div className="relative flex h-full flex-col">
                    <span className="grid h-11 w-11 place-items-center rounded-xl border border-primary/15 bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <item.icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-6 text-base font-semibold leading-6 text-foreground">{item.title}</h3>
                    <p className="mt-3 grow text-sm leading-6 text-muted-foreground">{item.description}</p>
                    <span className="mt-5 block h-px bg-border" />
                    <span className="mt-4 inline-flex w-fit rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">{item.signal}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimateSection>
      </section>

      {/* Timeline */}
      <section className="bg-card py-16 md:py-20">
        <AnimateSection className="container mx-auto px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Our story</p>
            <h2 className="mt-4 text-3xl font-bold leading-tight tracking-normal text-foreground">Built around the property decision journey.</h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              Inspired by the way buyers and investors actually research Dubai real estate: search first, verify context, compare tradeoffs, then enquire with confidence.
            </p>
          </div>

          <div className="mx-auto mt-14 max-w-4xl">
            {milestones.map((item, index) => (
              <div key={item.title} className="grid gap-6 border-l border-border pb-10 pl-6 last:pb-0 md:grid-cols-[160px_1fr] md:gap-10 md:pl-8">
                <div className="relative">
                  <span className="absolute -left-[31px] top-1 grid h-5 w-5 place-items-center rounded-full border border-primary bg-card text-primary md:-left-[39px]">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </span>
                  <p className="text-sm font-semibold text-primary">{item.period}</p>
                </div>

                <div className={cn('card-entrance rounded-xl border border-border bg-background p-5 shadow-sm', index === 0 && 'border-primary/30 bg-primary/5')}>
                  <h3 className="text-lg font-semibold leading-7 text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </AnimateSection>
      </section>

      {/* Contact form */}
      <section className="border-t border-border bg-[oklch(0.965_0.012_260.47)] py-16 md:py-20">
        <AnimateSection className="container mx-auto grid gap-10 px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Talk to us</p>
            <h2 className="mt-4 text-3xl font-bold leading-tight tracking-normal text-foreground">Need help narrowing the next property move?</h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">Share what you are comparing. We will route your request with the context needed for a useful follow-up.</p>
          </div>

          <div className="rounded-[18px] border border-border bg-card p-[clamp(1.25rem,3vw,2rem)] shadow-[0_14px_34px_oklch(0.2_0.03_263.61_/_0.10)]">
            <ContactLeadForm />
          </div>
        </AnimateSection>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-background py-14">
        <AnimateSection className="container mx-auto flex flex-col items-start justify-between gap-6 px-6 lg:flex-row lg:items-center lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Start exploring</p>
            <h2 className="mt-3 text-2xl font-bold tracking-normal text-foreground">Find the property context you need before the next viewing.</h2>
          </div>
          <Link href="/search" className={cn(buttonVariants({ size: 'lg' }), 'gap-2')}>
            Browse properties
            <ArrowRight className="h-4 w-4" />
          </Link>
        </AnimateSection>
      </section>
    </main>
  );
}
