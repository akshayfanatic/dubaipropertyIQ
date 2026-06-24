import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import type { Area } from '@/types/areas';

type AreaCardProps = Pick<Area, 'name' | 'photos' | 'slug'> & {
  citySlug: string;
};

export function AreaCard({ name, photos, slug, citySlug }: AreaCardProps) {
  const firstImage = photos?.[0]?.url;

  return (
    <Link href={`/areas/${citySlug}/${slug}`} className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
      <article className="relative min-h-[340px] transform-gpu overflow-hidden rounded-2xl border border-border bg-card shadow-[9px_9px_22px_oklch(0.2_0.03_263.61_/_0.10),-7px_-7px_18px_oklch(0.985_0.008_260.47_/_0.80)] transition-[box-shadow,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-primary/30 hover:shadow-[0_0_0_1px_oklch(0.55_0.20_260.47_/_0.16),0_0_34px_oklch(0.55_0.20_260.47_/_0.22),14px_14px_32px_oklch(0.2_0.03_263.61_/_0.13),-9px_-9px_22px_oklch(0.985_0.008_260.47_/_0.92)] motion-reduce:transition-none">
        <ImageWithFallback
          src={firstImage}
          alt={name}
          fill
          unoptimized
          className="transform-gpu transition-[transform,filter] duration-500 ease-in-out group-hover:-translate-y-1 group-hover:scale-[1.035] group-hover:brightness-[0.92] group-hover:saturate-[1.03] motion-reduce:transition-none motion-reduce:group-hover:translate-y-0 motion-reduce:group-hover:scale-100"
          fallbackClassName="absolute inset-0 rounded-none bg-muted text-muted-foreground"
        />

        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_42%,oklch(0.18_0.05_260.47_/_0.58)_100%),linear-gradient(135deg,oklch(0.55_0.20_260.47_/_0.14),transparent_48%)]" />

        <div className="absolute inset-x-3 bottom-3 z-10 grid translate-y-[calc(100%_-_96px)] transform-gpu gap-3 overflow-hidden rounded-[18px] border border-primary-foreground/30 bg-background/84 p-4 shadow-[0_14px_30px_oklch(0.18_0.05_260.47_/_0.22)] backdrop-blur-[14px] backdrop-saturate-[1.16] transition-all duration-100 ease-in-out will-change-transform before:mx-auto before:-mt-1 before:mb-0.5 before:h-1 before:w-10 before:rounded-full before:bg-muted-foreground/35 before:opacity-0 before:transition-all before:duration-100 before:ease-in-out group-hover:translate-y-0 group-hover:bg-[linear-gradient(145deg,oklch(0.985_0.008_260.47_/_0.88),oklch(0.92_0.02_260.47_/_0.72))] group-hover:before:opacity-100 motion-reduce:transition-none">
          <div className="min-w-0 transition-all duration-100 ease-in-out group-hover:-translate-y-0.5">
            <span className="mb-1 block text-xs font-extrabold uppercase tracking-[0.08em] text-primary">Area guide</span>
            <h2 className="truncate text-xl font-extrabold leading-tight tracking-normal text-foreground">{name}</h2>
          </div>

          <div className="translate-y-2 opacity-0 transition-all duration-100 ease-in-out group-hover:translate-y-0 group-hover:opacity-100">
            <p className="text-sm font-semibold leading-6 text-muted-foreground">Explore community information, local context, and available properties linked to {name}.</p>
            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-extrabold text-primary">
              Open guide
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
