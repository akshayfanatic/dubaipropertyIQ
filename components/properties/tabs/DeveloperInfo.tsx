import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { Building2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface DeveloperInfoProps {
  developer: {
    name: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    logo_url?: any;
    description?: string | null;
    slug?: string | null;
  } | null;
}

export function DeveloperInfo({ developer }: DeveloperInfoProps) {
  if (!developer) return null;

  const developerLink = `/developers/${developer.slug || '#'}`;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-4 py-2">
      <div className="flex items-center gap-4">
        {/* Logo Container */}
        <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-border/50 bg-white shadow-sm shrink-0 flex items-center justify-center p-3 group transition-all hover:shadow-md">
          {developer.logo_url ? (
            <ImageWithFallback
              src={typeof developer.logo_url === 'string' ? developer.logo_url : developer.logo_url?.url}
              alt={developer.name}
              fill
              className="object-contain p-2 transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <Building2 className="w-10 h-10 text-muted-foreground/40" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-lg sm:text-xl font-bold text-foreground line-clamp-1">{developer.name}</h3>
          <p className="text-muted-foreground text-xs sm:text-sm font-medium">Official Project Developer</p>
        </div>
      </div>

      <Link
        href={developerLink}
        className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 sm:py-2 rounded-xl bg-primary/5 hover:bg-primary/10 text-primary text-sm font-bold transition-all hover:gap-3 group"
      >
        View Projects
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}
