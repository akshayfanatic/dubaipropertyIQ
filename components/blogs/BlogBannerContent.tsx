import { CalendarDays, Clock3, UserRound } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { Blog } from '@/types/blog';

// Blog-specific hero copy and metadata rendered inside the shared PageBanner.
type BlogBannerContentProps = Pick<Blog, 'title' | 'excerpt' | 'created_at'> & {
  readTime: string;
  onImage?: boolean;
};

function formatDate(date?: string | null) {
  if (!date) return 'Recent';

  return new Intl.DateTimeFormat('en', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

function BlogArticleMeta({ createdAt, readTime, onImage = false }: { createdAt?: string | null; readTime: string; onImage?: boolean }) {
  const items = [
    { icon: UserRound, label: 'Dubai Property IQ' },
    { icon: CalendarDays, label: formatDate(createdAt) },
    { icon: Clock3, label: readTime },
  ];

  return (
    <div className={cn('mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium', onImage ? 'text-primary-foreground/88' : 'text-muted-foreground')}>
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <span key={item.label} className="inline-flex items-center gap-2">
            <Icon className={cn('size-4 shrink-0', onImage ? 'text-primary-foreground/78' : 'text-primary')} />
            {item.label}
          </span>
        );
      })}
    </div>
  );
}

export function BlogBannerContent({ title, excerpt, created_at, readTime, onImage = false }: BlogBannerContentProps) {
  return (
    <div className={cn('max-w-4xl', onImage && 'rounded-2xl border border-white/16 bg-white/8 px-5 py-6 shadow-xl shadow-black/12 backdrop-blur-md sm:px-7 sm:py-8')}>
      <span
        className={cn(
          'inline-flex items-center gap-2 text-xs font-bold uppercase before:h-0.5 before:w-6 before:rounded-full before:content-[""]',
          onImage ? 'text-primary-foreground/92 before:bg-primary-foreground/80' : 'text-primary before:bg-primary',
        )}
      >
        Property guide
      </span>
      <h1 className={cn('mt-5 max-w-4xl text-3xl font-extrabold leading-[1.12] text-balance sm:text-5xl', onImage ? 'text-primary-foreground drop-shadow-sm' : 'text-foreground')}>{title}</h1>
      {excerpt && <p className={cn('mt-5 max-w-3xl text-base leading-7 text-pretty sm:text-lg', onImage ? 'text-primary-foreground/90' : 'text-muted-foreground')}>{excerpt}</p>}
      <BlogArticleMeta createdAt={created_at} readTime={readTime} onImage={onImage} />
    </div>
  );
}
