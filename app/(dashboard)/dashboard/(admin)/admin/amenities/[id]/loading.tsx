import { FormSkelton } from '@/components/shared/form-skelton';

export default function AmenityLoading() {
  return (
    <FormSkelton
      fields={[
        { labelWidth: 'w-16', inputHeight: 'h-10' }, // Name
        { labelWidth: 'w-12', inputHeight: 'h-10' }, // Slug
        { labelWidth: 'w-12', inputHeight: 'h-24' }, // Logo (ImageUploader)
        { labelWidth: 'w-20', inputHeight: 'h-24', isTextarea: true }, // Description
      ]}
      showPageHeader={true}
      showBackButton={true}
      showSubmitButton={true}
      submitAlign="right"
    />
  );
}
