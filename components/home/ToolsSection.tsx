'use client';

import { useState, type ComponentType } from 'react';
import Link from 'next/link';
import { ArrowRight, BarChart3, Calculator, Clock3, FileText, Home, ShieldCheck, TrendingUp } from 'lucide-react';

import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/utils/price';

type ToolItem = {
  title: string;
  description: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
};

const tools: ToolItem[] = [
  {
    title: 'True Cost Calculator',
    description: 'Full ownership cost over time',
    href: '/calculators/rent-vs-buy-calculator',
    icon: FileText,
  },
  {
    title: 'Rental Yield',
    description: 'Gross yield by price and rent',
    href: '/calculators/rent-vs-buy-calculator',
    icon: TrendingUp,
  },
  {
    title: 'Mortgage Calculator',
    description: 'Monthly payment and interest',
    href: '/calculators/mortgage-calculator',
    icon: Calculator,
  },
  {
    title: 'Service Charge Index',
    description: 'Compare building costs',
    href: '/search',
    icon: Home,
  },
  {
    title: 'Golden Visa Checker',
    description: 'Eligibility and next steps',
    href: '/pages/golden-visa-guide',
    icon: ShieldCheck,
  },
  {
    title: 'Price Index',
    description: 'DLD-backed price trends',
    href: '/areas/dubai',
    icon: BarChart3,
  },
];

function ToolLink({ tool, index }: { tool: ToolItem; index: number }) {
  const Icon = tool.icon;

  return (
    <Link
      href={tool.href}
      className="card-entrance group relative flex min-h-27 overflow-hidden rounded-2xl border border-border bg-background p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-lg hover:shadow-foreground/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      style={{ animationDelay: `${index * 90}ms`, transitionDelay: `${index * 20}ms` }}
    >
      <span className="absolute inset-x-0 top-0 h-1 bg-primary/0 transition-colors duration-300 group-hover:bg-primary" />
      <span className="absolute -right-10 -top-10 size-24 rounded-full bg-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <span className="relative z-10 flex w-full items-start gap-3">
        <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/10 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground group-hover:ring-primary/20">
          <Icon className="size-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[0.98rem] font-bold leading-5 text-foreground">{tool.title}</span>
          <span className="mt-1.5 block text-sm leading-5 text-muted-foreground">{tool.description}</span>
          <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-primary opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100">
            Open tool
            <ArrowRight className="size-4 group-hover:animate-float-x" />
          </span>
        </span>
      </span>
    </Link>
  );
}

export function ToolsSection() {
  const [purchasePrice, setPurchasePrice] = useState(2450000);
  const [annualRent, setAnnualRent] = useState(191000);
  const grossYield = purchasePrice > 0 ? (annualRent / purchasePrice) * 100 : 0;
  const monthlyIncome = annualRent / 12;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {tools.map((tool, index) => (
          <ToolLink key={tool.title} tool={tool} index={index} />
        ))}
      </div>

      <div
        className="card-entrance relative overflow-hidden rounded-2xl bg-[linear-gradient(150deg,oklch(0.22_0.05_263.61),oklch(0.31_0.12_260.47))] p-6 text-primary-foreground shadow-xl shadow-foreground/18 sm:p-7"
        style={{ animationDelay: `${tools.length * 90}ms` }}
      >
        <div className="absolute inset-0 bg-radial-[at_100%_0%] from-primary/35 via-transparent to-transparent" />
        <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-primary-foreground/6" />
        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-primary-foreground/70">
            <Clock3 className="size-3.5 icon-wiggle-subtle" />
            Try it live
          </span>

          <div className="mt-3">
            <h3 className="text-xl font-extrabold leading-6 text-primary-foreground">Rental Yield Calculator</h3>
            <p className="mt-2 text-sm leading-6 text-primary-foreground/72">Drag to see your gross yield update instantly.</p>
          </div>

          <div className="mt-6 space-y-5">
            <div>
              <label htmlFor="purchase-price" className="flex justify-between gap-3 text-xs font-bold text-primary-foreground/78">
                <span>Purchase price</span>
                <b className="font-bold text-primary-foreground">{formatPrice(purchasePrice)}</b>
              </label>
              <input
                id="purchase-price"
                type="range"
                min={500000}
                max={10000000}
                step={50000}
                value={purchasePrice}
                onChange={(event) => setPurchasePrice(Number(event.target.value))}
                className="mt-3 w-full accent-primary-foreground"
              />
            </div>

            <div>
              <label htmlFor="annual-rent" className="flex justify-between gap-3 text-xs font-bold text-primary-foreground/78">
                <span>Expected annual rent</span>
                <b className="font-bold text-primary-foreground">{formatPrice(annualRent)}</b>
              </label>
              <input
                id="annual-rent"
                type="range"
                min={20000}
                max={800000}
                step={1000}
                value={annualRent}
                onChange={(event) => setAnnualRent(Number(event.target.value))}
                className="mt-3 w-full accent-primary-foreground"
              />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="card-entrance rounded-xl border border-primary-foreground/14 bg-primary-foreground/8 p-4" style={{ animationDelay: `${tools.length * 90 + 120}ms` }}>
              <span className="block text-xs text-primary-foreground/66">Gross yield</span>
              <b className={cn('mt-1 block text-2xl font-extrabold tabular-nums', grossYield >= 7 ? 'text-emerald-300' : 'text-primary-foreground')}>{grossYield.toFixed(1)}%</b>
            </div>
            <div className="card-entrance rounded-xl border border-primary-foreground/14 bg-primary-foreground/8 p-4" style={{ animationDelay: `${tools.length * 90 + 180}ms` }}>
              <span className="block text-xs text-primary-foreground/66">Monthly income</span>
              <b className="mt-1 block text-xl font-extrabold tabular-nums text-primary-foreground">{formatPrice(Math.round(monthlyIncome))}</b>
            </div>
          </div>

          <p className="mt-4 text-xs leading-5 text-primary-foreground/55">Indicative only. Use the full calculators for fees, service charges, and financing assumptions.</p>
        </div>
      </div>
    </div>
  );
}
