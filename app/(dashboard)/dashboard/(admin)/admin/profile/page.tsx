import { requireAuth } from '@/lib/auth/guards';
import { PageHeader } from '@/components/shared/page-header';
import { StyledTabs } from '@/components/shared/styled-tabs';
import { ProfileBasicInfoForm } from '@/components/dashboard/admin/profile/ProfileBasicInfoForm';
import { PasswordChangeForm } from '@/components/dashboard/admin/profile/PasswordChangeForm';

export default async function ProfilePage() {
  const user = await requireAuth();

  const initialData = {
    email: user.email,
    displayName: user.user_metadata?.display_name || null,
    avatarUrl: user.user_metadata?.avatar_url || null,
  };

  const tabs = [
    {
      value: 'profile',
      label: 'Profile',
      content: <ProfileBasicInfoForm initialData={initialData} />,
    },
    {
      value: 'security',
      label: 'Security',
      content: <PasswordChangeForm />,
    },
  ] as const;

  return (
    <div className="mx-auto space-y-8">
      <PageHeader title="Profile Settings" description="Manage your account settings and preferences." showBackButton />

      <StyledTabs tabs={tabs} defaultValue="profile" className="w-full" />
    </div>
  );
}
