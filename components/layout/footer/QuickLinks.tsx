'use client';

import Link from 'next/link';
import useSWR from 'swr';
import type { Page } from '@/types/page';
import type { LinkItem } from '@/types/footer';

type QuickLinksProps = {
  title?: string;
  links?: LinkItem[];
  excludeHrefs?: string[];
  includeDynamic?: boolean;
};
export function QuickLinks({ title = '', links = [], excludeHrefs = [], includeDynamic = true }: QuickLinksProps) {
  const { data: response } = useSWR<{ data: Page[] }>('/api/public/pages');
  const staticHrefs = new Set([...links.map((link) => link.href), ...excludeHrefs]);
  const pageLinks = includeDynamic ? (response?.data || []).map((page) => ({ label: page.title, href: `/pages/${page.slug}` })).filter((link) => !staticHrefs.has(link.href)) : [];
  const allLinks = [...links, ...pageLinks];

  if (allLinks.length === 0) return null;

  return (
    <div className="space-y-4">
      {title ? <h3 className="text-[0.82rem] font-bold uppercase tracking-[0.1em] text-white">{title}</h3> : null}
      <ul className="grid gap-1">
        {allLinks.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="block py-1 text-[0.88rem] text-white/65 transition-all duration-300 ease-out hover:pl-1.5 hover:text-[#9cc4f7]">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
