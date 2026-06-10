'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/providers/auth-provider';

export function CustomerAccountAvatar() {
  const { user } = useAuth();
  const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Customer';
  const initials = displayName
    .split(' ')
    .map((name) => name[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  const avatarUrl = user?.user_metadata?.avatar_url ?? undefined;

  return (
    <div className="flex min-w-0 items-center gap-3 px-2 py-2">
      <Avatar className="h-12 w-12 ring-2 ring-primary/15">
        <AvatarImage src={avatarUrl} alt={displayName} />
        <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">{initials}</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">{displayName}</p>
        <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
      </div>
    </div>
  );
}
