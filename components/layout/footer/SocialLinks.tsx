'use client';

import Link from 'next/link';
import { Facebook, Instagram, Linkedin, MessageCircle, Twitter } from 'lucide-react';
import { useSettings } from '@/hooks/data/public/useSettings';

const socialConfig = [
  { key: 'instagram' as const, icon: Instagram, label: 'Instagram', group: 'social' as const },
  { key: 'linkedin' as const, icon: Linkedin, label: 'LinkedIn', group: 'social' as const },
  { key: 'twitter' as const, icon: Twitter, label: 'Twitter/X', group: 'social' as const },
  { key: 'facebook' as const, icon: Facebook, label: 'Facebook', group: 'social' as const },
  { key: 'whatsapp' as const, icon: MessageCircle, label: 'WhatsApp', group: 'contact' as const },
];

type SocialLinksProps = {
  title?: string;
};
export function SocialLinks({ title = '' }: SocialLinksProps) {
  const { data } = useSettings();
  const social = data?.social || {};
  const contact = data?.contact || {};

  return (
    <div>
      {title ? <h3 className="mb-3 text-[0.82rem] font-bold uppercase tracking-[0.1em] text-white">{title}</h3> : null}
      <div className="flex items-center gap-2.5">
        {socialConfig.map(({ key, icon: Icon, label, group }) => {
          const rawUrl = group === 'social' ? (social[key as keyof typeof social] as string | undefined) : (contact.whatsapp as string | undefined);
          const url = group === 'contact' && rawUrl ? `https://wa.me/${rawUrl}` : rawUrl;
          if (!url) return null;

          return (
            <Link
              key={key}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="grid size-10 place-items-center rounded-[11px] border border-white/10 bg-white/[0.06] text-white/80 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[#1d6fe0] hover:bg-[#1d6fe0] hover:text-white"
            >
              <Icon className="size-[18px]" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
