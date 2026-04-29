'use client';

import Link from 'next/link';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { useSettings } from '@/hooks/data/public/useSettings';

const socialConfig = [
  { key: 'facebook' as const, icon: Facebook, label: 'Facebook' },
  { key: 'instagram' as const, icon: Instagram, label: 'Instagram' },
  { key: 'linkedin' as const, icon: Linkedin, label: 'LinkedIn' },
  { key: 'twitter' as const, icon: Twitter, label: 'Twitter/X' },
];

type SocialLinksProps = {
  title?: string;
};
export function SocialLinks({ title = '' }: SocialLinksProps) {
  const { data } = useSettings();
  const social = data?.social || {};

  return (
    <div>
      {title ? <h3 className="text-sm font-semibold mb-3">{title}</h3> : null}
      <div className="flex items-center gap-2">
        {socialConfig.map(({ key, icon: Icon, label }) => {
          const url = social[key] as string | undefined;
          if (!url) return null;

          return (
            <Link
              key={key}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="group flex h-11 w-11 items-center justify-center rounded-full bg-linear-to-br from-muted-foreground/10 to-muted-foreground/5 text-muted-foreground transition-all duration-300 hover:scale-110 hover:bg-linear-to-br hover:from-primary hover:to-primary/80 hover:text-background hover:shadow-lg hover:shadow-primary/25"
            >
              <Icon className="h-4.5 w-4.5 transition-transform duration-300 group-hover:rotate-6" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
