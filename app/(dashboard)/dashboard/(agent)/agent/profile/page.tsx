import { AgentProfileNotProvisioned } from '@/components/dashboard/agent/profile/AgentProfileNotProvisioned';
import { AgentProfileSettingsTabs } from '@/components/dashboard/agent/profile/AgentProfileSettingsTabs';
import { PageHeader } from '@/components/shared/page-header';
import { Badge } from '@/components/ui/badge';
import { getMyAgentProfile } from '@/lib/db/agent-profile/queries';
import { requireAuth } from '@/lib/auth/guards';

export default async function AgentProfilePage() {
  const user = await requireAuth();
  const { success, data: profile, message } = await getMyAgentProfile();

  if (!success) {
    throw new Error(message || 'Failed to load agent profile');
  }

  if (!profile) {
    return <AgentProfileNotProvisioned />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <PageHeader title="Agent Profile Settings" description="Manage your agent account details and security." showBackButton />
        <Badge variant={profile.status === 'active' ? 'default' : 'outline'} className="capitalize">
          {profile.status}
        </Badge>
      </div>

      <AgentProfileSettingsTabs profile={profile} avatarUrl={user.user_metadata?.avatar_url || null} />
    </div>
  );
}
