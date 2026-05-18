'use client';
import { Button } from '@/components/ui/button';
import { ExternalLink, Mail } from 'lucide-react';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';

interface DeveloperProfileCardProps {
  name: string;
  logoUrl?: string | null;
  description?: string | null;
  email?: string | null;
  websiteUrl?: string | null;
}

export function DeveloperProfileCard({ name, logoUrl, description, email, websiteUrl }: DeveloperProfileCardProps) {
  return (
    <div className="group relative w-full max-w-sm rounded-[2.5rem] border border-white/20 bg-black/30 p-8 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] text-white h-full flex flex-col justify-between overflow-hidden">
      {/* Decorative inner glow/gradient */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl opacity-30" />

      <div className="relative flex flex-col h-full">
        {/* Logo - Glassy Container */}
        <div className="mb-8 flex h-24 w-24 items-center justify-center overflow-hidden rounded-[1.5rem] bg-white/95 p-4 shadow-xl ring-1 ring-white/20 group-hover:scale-105 transition-transform duration-500">
          <ImageWithFallback src={logoUrl || null} alt={name} width={96} height={96} className="h-full w-full object-contain" />
        </div>

        {/* Info Area */}
        <div className="space-y-4 mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-white drop-shadow-md">{name}</h2>
          {description && <p className="text-sm leading-relaxed text-white/80 font-medium line-clamp-4">{description}</p>}
        </div>

        {/* Contact Section */}
        <div className="space-y-5 pt-6 border-t border-white/10 card-entrance">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Contact developer</h3>
          <div className="grid grid-cols-2  gap-3">
            {/* Primary Action Button */}
            <Button
              variant="default"
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-bold h-12 rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-95"
              asChild
            >
              <a href={email ? `mailto:${email}` : '#'}>
                <Mail className="mr-2 h-4 w-4 fill-current/20 icon-wiggle-subtle" />
                Email
              </a>
            </Button>

            {websiteUrl && (
              <Button
                variant="outline"
                className="border-white/20 bg-white/5 text-white hover:border-white/30 hover:bg-white/15 hover:text-white font-bold h-12 rounded-2xl backdrop-blur-md transition-all active:scale-95 gap-2.5"
                asChild
              >
                <a href={websiteUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 icon-wiggle-subtle" />
                  Website
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
