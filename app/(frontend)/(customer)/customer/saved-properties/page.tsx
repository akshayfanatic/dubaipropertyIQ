import { CustomerSavedPropertiesList } from '@/components/customer/CustomerSavedPropertiesList';
import { getSavedProperties } from '@/lib/db/properties/queries';

export const dynamic = 'force-dynamic';

const CustomerSavedPropertiesPage = async () => {
  const savedPropertiesResponse = await getSavedProperties();
  const savedProperties = savedPropertiesResponse.success ? (savedPropertiesResponse.data ?? []) : [];

  return <CustomerSavedPropertiesList initialProperties={savedProperties} />;
};

export default CustomerSavedPropertiesPage;
