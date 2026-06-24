import type { ReactNode } from 'react';

// Responsibility: provide the blog article layout shell; callers provide TOC, article, and follow-up sections.
interface BlogArticlePageProps {
  tableOfContents: ReactNode;
  article: ReactNode;
  children?: ReactNode;
}

export function BlogArticlePage({ tableOfContents, article, children }: BlogArticlePageProps) {
  return (
    <main className="bg-background">
      <div className="mx-auto grid w-[min(92%,1180px)] gap-8 border-t border-border py-10 lg:grid-cols-[240px_minmax(0,760px)] lg:justify-center lg:py-12">
        <aside className="lg:sticky lg:top-24 lg:self-start">{tableOfContents}</aside>
        <article className="min-w-0">{article}</article>
      </div>

      {children}
    </main>
  );
}
