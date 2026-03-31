import { FormSkelton } from '@/components/shared/form-skelton';

export default function EditPropertyLoading() {
  return (
    <FormSkelton
      fields={[
        { labelWidth: 'w-12', inputHeight: 'h-10' }, // Title
        { labelWidth: 'w-20', inputHeight: 'h-24', isTextarea: true }, // Description
        { labelWidth: 'w-16', inputHeight: 'h-10' }, // Category
        { labelWidth: 'w-20', inputHeight: 'h-10' }, // Bedrooms & Bathrooms
        { labelWidth: 'w-16', inputHeight: 'h-10' }, // Size & Price
        { labelWidth: 'w-12', inputHeight: 'h-10' }, // Status
        { labelWidth: 'w-24', inputHeight: 'h-10' }, // Golden Visa / Photos
        { labelWidth: 'w-20', inputHeight: 'h-10' }, // Floor Plan
      ]}
      showPageHeader={true}
      showBackButton={true}
      showSubmitButton={true}
      submitAlign="right"
    />
  );
}
