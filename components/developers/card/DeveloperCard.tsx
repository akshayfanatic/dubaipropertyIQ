'use client';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { Developer } from '@/types/developer';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import type { Json } from '@/types/db/supabase-generated';
import { Building2, Calendar, ArrowUpRight } from 'lucide-react';

type DeveloperCardProps = Developer;

function getLogoUrl(logo_url: Json | null): string | null {
  if (!logo_url) return null;
  if (typeof logo_url === 'string') return logo_url;
  if (typeof logo_url === 'object' && 'url' in logo_url && typeof logo_url.url === 'string') return logo_url.url;
  return null;
}

export function DeveloperCard({ name, logo_url, total_projects, years_active }: DeveloperCardProps) {
  const logoSrc = getLogoUrl(logo_url);

  return (
    <Card className="group relative overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 bg-background cursor-pointer card-entrance">
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative p-5">
        <div className="flex items-center gap-4">
          {/* Logo Container with reusable wiggle utility */}
          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-linear-to-br from-muted to-muted/50 flex items-center justify-center shrink-0 ring-1 ring-border/50 group-hover:ring-primary/20 transition-all shadow-sm icon-wiggle-subtle">
            <ImageWithFallback src={logoSrc} alt={name} width={64} height={64} className="object-cover w-full h-full p-3 transition-transform duration-500 group-hover:scale-110" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <h3 className="font-bold text-base truncate group-hover:text-primary transition-colors tracking-tight">{name}</h3>
              <ArrowUpRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>

            {(total_projects ?? 0) > 0 || (years_active ?? 0) > 0 ? (
              <div className="flex flex-wrap gap-2 mt-2">
                {(total_projects ?? 0) > 0 && (
                  <span className="flex items-center gap-1.5 bg-muted/50 text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2.5 py-1 rounded-full border border-border/50 group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                    <Building2 className="w-3 h-3" />
                    <span className="text-foreground group-hover:text-primary">{total_projects}</span> Projects
                  </span>
                )}
                {(years_active ?? 0) > 0 && (
                  <span className="flex items-center gap-1.5 bg-muted/50 text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2.5 py-1 rounded-full border border-border/50 group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                    <Calendar className="w-3 h-3" />
                    <span className="text-foreground group-hover:text-primary">{years_active}</span> Years
                  </span>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </Card>
  );
}

interface DeveloperCardSkeletonProps {
  count?: number;
}

export function DeveloperCardSkeleton({ count = 1 }: DeveloperCardSkeletonProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="border-border/50">
          <div className="relative p-5">
            <div className="flex items-center gap-4">
              <Skeleton className="w-16 h-16 rounded-2xl shrink-0" />
              <div className="flex-1 min-w-0 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <div className="flex gap-4">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-14 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
