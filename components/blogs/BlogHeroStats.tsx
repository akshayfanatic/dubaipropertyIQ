import type { BlogStats } from '@/lib/db/blogs/queries';

type BlogHeroStatsProps = {
  stats: BlogStats | null;
};

const statItems = [
  { key: 'blogs', label: 'Blogs' },
  { key: 'categories', label: 'Categories' },
  { key: 'tags', label: 'Tags' },
] as const;

export function BlogHeroStats({ stats }: BlogHeroStatsProps) {
  return (
    <div className="grid min-w-0 grid-cols-3 gap-2 sm:min-w-80">
      {statItems.map(({ key, label }) => (
        <div key={key} className="rounded-xl border border-border bg-card p-3 shadow-sm">
          <strong className="block text-lg font-extrabold leading-none text-foreground">{stats?.[key] ?? 0}</strong>
          <span className="mt-1 block text-xs font-extrabold uppercase text-muted-foreground">{label}</span>
        </div>
      ))}
    </div>
  );
}
