import Link from 'next/link';
import { Building2, MapPin } from 'lucide-react';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import type { Area } from '@/types/areas';

type AreaCardProps = Pick<Area, 'name' | 'photos' | 'slug'> & {
  citySlug: string;
};

export function AreaCard({ name, photos, slug, citySlug }: AreaCardProps) {
  const firstImage = photos?.[0]?.url;

  return (
    <Link href={`/areas/${citySlug}/${slug}`} className="group block rounded-xl">
      <article className="relative aspect-4/3 overflow-hidden rounded-xl border border-border bg-card shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-xl active:translate-y-0 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
        <ImageWithFallback
          src={firstImage}
          alt={name}
          fill
          unoptimized
          className="transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          fallbackClassName="absolute inset-0 rounded-none bg-muted text-muted-foreground"
        />

        <div className="absolute inset-0 bg-linear-to-t from-foreground/85 via-foreground/20 to-foreground/5" />
        <div className="absolute inset-0 bg-primary/0 transition-colors duration-300 group-hover:bg-primary/10 group-focus-visible:bg-primary/10 motion-reduce:transition-none" />

        <div className="absolute bottom-0 left-0 right-0 p-4 text-primary-foreground">
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-md border border-primary-foreground/15 bg-primary-foreground/10 px-2.5 py-1 text-xs font-semibold leading-none text-primary-foreground/85 backdrop-blur-sm">
            <MapPin className="h-3.5 w-3.5 shrink-0" strokeWidth={2.4} />
            Community
          </div>
          <h2 className="flex max-w-[92%] items-start gap-2 text-xl font-bold leading-tight drop-shadow-sm">
            <Building2 className="mt-0.5 h-5 w-5 shrink-0 text-primary-foreground/85" strokeWidth={2.4} />
            <span className="line-clamp-2 min-w-0">{name}</span>
          </h2>
        </div>
      </article>
    </Link>
  );
}
