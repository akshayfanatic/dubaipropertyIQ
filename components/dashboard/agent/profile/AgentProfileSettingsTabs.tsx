import { PasswordChangeForm } from '@/components/dashboard/admin/profile/PasswordChangeForm';
import { StyledTabs } from '@/components/shared/styled-tabs';
import { AgentProfileForm } from './AgentProfileForm';
import { AgentVerifiedDetailsCard } from './AgentVerifiedDetailsCard';
import type { Tables } from '@/types/db/supabase-generated';

type AgentProfile = Tables<'agent_profiles'>;

interface AgentProfileSettingsTabsProps {
  profile: AgentProfile;
  avatarUrl?: string | null;
}

export function AgentProfileSettingsTabs({ profile, avatarUrl }: AgentProfileSettingsTabsProps) {
  const tabs = [
    {
      value: 'profile',
      label: 'Agent Profile',
      content: (
        <div className="grid gap-4 xl:grid-cols-[0.82fr_1.18fr]">
          <div className="flex flex-col gap-4">
            <AgentVerifiedDetailsCard profile={profile} />
          </div>

          <AgentProfileForm profile={profile} avatarUrl={avatarUrl} />
        </div>
      ),
    },
    {
      value: 'security',
      label: 'Security',
      content: <PasswordChangeForm />,
    },
  ] as const;

  return <StyledTabs tabs={tabs} defaultValue="profile" className="w-full" />;
}
