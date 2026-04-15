import { requireAuth } from '@/lib/auth/guards';
import { PageHeader } from '@/components/shared/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileBasicInfoForm } from '@/components/dashboard/admin/profile/ProfileBasicInfoForm';
import { PasswordChangeForm } from '@/components/dashboard/admin/profile/PasswordChangeForm';

export default async function ProfilePage() {
  const user = await requireAuth();

  const initialData = {
    email: user.email,
    displayName: user.user_metadata?.display_name || null,
    avatarUrl: user.user_metadata?.avatar_url || null,
  };

  return (
    <div className="mx-auto space-y-8">
      <PageHeader title="Profile Settings" description="Manage your account settings and preferences." showBackButton />

      {/* Tabs with lazy-loaded forms */}
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Lazy loaded only when tab is opened */}
        <TabsContent value="profile" className="mt-6">
          <ProfileBasicInfoForm initialData={initialData} />
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <PasswordChangeForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
