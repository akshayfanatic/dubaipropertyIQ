'use client';

import Link from 'next/link';
import useSWR from 'swr';
import type { Page } from '@/types/page';

type QuickLinksProps = {
  title?: string;
};
export function QuickLinks({ title = '' }: QuickLinksProps) {
  const { data: response } = useSWR<{ data: Page[] }>('/api/public/pages');
  const pages = response?.data || [];

  if (pages.length === 0) return null;

  return (
    <div>
      {title ? <h3 className="text-sm font-semibold mb-3">{title}</h3> : null}
      <ul className="space-y-2">
        {pages.map((page) => (
          <li key={page.id}>
            <Link href={`/pages/${page.slug}`} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              {page.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
