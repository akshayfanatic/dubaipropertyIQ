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
    <Card className="group relative overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300">
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative p-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-linear-to-br from-muted to-muted/50 flex items-center justify-center shrink-0 ring-1 ring-border/50 group-hover:ring-primary/20 transition-all">
            <ImageWithFallback src={logoSrc} alt={name} width={64} height={64} className="object-cover w-full h-full p-3" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-semibold text-base truncate group-hover:text-primary transition-colors">{name}</h3>
              <ArrowUpRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
            {(total_projects ?? 0) > 0 || (years_active ?? 0) > 0 ? (
              <div className="flex gap-4 text-xs text-muted-foreground mt-2">
                {(total_projects ?? 0) > 0 && (
                  <span className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-full">
                    <Building2 className="w-3 h-3" />
                    <span className="font-medium text-foreground">{total_projects}</span> Projects
                  </span>
                )}
                {(years_active ?? 0) > 0 && (
                  <span className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-full">
                    <Calendar className="w-3 h-3" />
                    <span className="font-medium text-foreground">{years_active}</span> Years
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
