import Link from 'next/link';
import { ArrowRight, Building2, MapPin } from 'lucide-react';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import type { Area } from '@/types/areas';

type AreaCardProps = Pick<Area, 'name' | 'photos' | 'slug'> & {
  citySlug: string;
};

export function AreaCard({ name, photos, slug, citySlug }: AreaCardProps) {
  const firstImage = photos?.[0]?.url;

  return (
    <Link href={`/areas/${citySlug}/${slug}`} className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
      <article className="card-entrance relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-card shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-xl active:translate-y-0 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
        <ImageWithFallback
          src={firstImage}
          alt={name}
          fill
          unoptimized
          className="transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          fallbackClassName="absolute inset-0 rounded-none bg-muted text-muted-foreground"
        />

        <div className="absolute inset-0 bg-linear-to-t from-foreground/88 via-foreground/28 to-foreground/5" />
        <div className="absolute inset-0 bg-primary/0 transition-colors duration-300 group-hover:bg-primary/10 group-focus-visible:bg-primary/10 motion-reduce:transition-none" />

        <div className="absolute left-4 top-4">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary-foreground/15 bg-primary-foreground/12 px-3 py-1 text-xs font-bold leading-none text-primary-foreground/90 shadow-sm backdrop-blur-sm">
            <MapPin className="h-3.5 w-3.5 shrink-0" strokeWidth={2.4} />
            Community
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-3">
          <div className="rounded-xl border border-primary-foreground/14 bg-foreground/38 p-3 text-primary-foreground shadow-lg backdrop-blur-md">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="line-clamp-2 text-xl font-extrabold leading-6 tracking-normal drop-shadow-sm">{name}</h2>
                <div className="mt-2 flex items-center gap-1.5 text-sm font-medium text-primary-foreground/78">
                  <Building2 className="icon-wiggle-subtle size-4" strokeWidth={2.4} />
                  <span>Explore area guide</span>
                </div>
              </div>
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary-foreground text-primary shadow-sm transition-transform duration-300 group-hover:translate-x-0.5">
                <ArrowRight className="size-4 group-hover:animate-float-x" />
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
