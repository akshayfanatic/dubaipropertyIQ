import { Suspense } from 'react';
import { getGroupedSettings } from '@/lib/db/settings/queries';
import { StyledTabs } from '@/components/shared/styled-tabs';
import { PageHeader } from '@/components/shared/page-header';
import { SETTING_GROUP_LABELS, SETTING_GROUPS } from '@/config/settings';
import { GeneralSettingsForm } from '@/components/dashboard/admin/settings/GeneralSettingsForm';
import { ContactSettingsForm } from '@/components/dashboard/admin/settings/ContactSettingsForm';
import { SocialSettingsForm } from '@/components/dashboard/admin/settings/SocialSettingsForm';

export const metadata = {
  title: 'Site Settings',
  description: 'Manage global site settings',
};

export default async function SettingsPage() {
  const settingsResult = await getGroupedSettings();

  const initialData = settingsResult.success
    ? {
        general: settingsResult.data?.general || {},
        contact: settingsResult.data?.contact || {},
        social: settingsResult.data?.social || {},
      }
    : {
        general: {},
        contact: {},
        social: {},
      };

  const tabs = SETTING_GROUPS.map((group) => ({
    value: group,
    label: SETTING_GROUP_LABELS[group],
    content:
      group === 'general' ? (
        <GeneralSettingsForm initialData={initialData.general} />
      ) : group === 'contact' ? (
        <ContactSettingsForm initialData={initialData.contact} />
      ) : (
        <SocialSettingsForm initialData={initialData.social} />
      ),
  }));

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage your site configuration and preferences." showBackButton />

      <Suspense fallback={<div>Loading settings...</div>}>
        <StyledTabs tabs={tabs} defaultValue="general" />
      </Suspense>
    </div>
  );
}
