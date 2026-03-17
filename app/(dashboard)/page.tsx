import { Building2, TrendingUp, MapPin, Users } from 'lucide-react';
import Link from 'next/link';
import { serverClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';

export default async function DashboardPage() {
  const supabase = await serverClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'User';

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {displayName}!</h1>
        <p className="text-muted-foreground">Here&apos;s your Dubai real estate intelligence overview.</p>
      </div>

      {/* Stats Grid - Placeholder */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border/60 bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Market Trend</p>
              <p className="text-2xl font-bold">--</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Properties</p>
              <p className="text-2xl font-bold">--</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Areas Tracked</p>
              <p className="text-2xl font-bold">--</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Saved Searches</p>
              <p className="text-2xl font-bold">--</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-border/60 bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard/profile">
            <Button variant="outline" className="cursor-pointer">
              Edit Profile
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
