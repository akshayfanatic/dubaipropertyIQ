import { ProfileBasicInfoForm } from '@/components/dashboard/admin/profile/ProfileBasicInfoForm';
import { requireAuth } from '@/lib/auth/guards';

const CustomerPage = async () => {
  const user = await requireAuth();

  const initialData = {
    email: user.email,
    displayName: user.user_metadata?.display_name || null,
    avatarUrl: user.user_metadata?.avatar_url || null,
  };

  return <ProfileBasicInfoForm initialData={initialData} />;
};

export default CustomerPage;
