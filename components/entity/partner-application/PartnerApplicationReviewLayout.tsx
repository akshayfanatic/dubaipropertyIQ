import type { ReactNode } from 'react';
import { PageHeader } from '@/components/shared/page-header';

interface PartnerApplicationReviewLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  actions: ReactNode;
}

export function PartnerApplicationReviewLayout({ title, description, children, actions }: PartnerApplicationReviewLayoutProps) {
  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description} showBackButton />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px] xl:items-start">
        <section className="min-w-0 space-y-6">{children}</section>
        <aside className="min-w-0 xl:sticky xl:top-6">{actions}</aside>
      </div>
    </div>
  );
}
