import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { noIndexMetadata } from '@/lib/utils/seo';

export const metadata: Metadata = {
  title: 'Become a Partner',
  ...noIndexMetadata,
};

export default function PartnerLayout({ children }: { children: ReactNode }) {
  return children;
}
