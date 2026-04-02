import { FormSkelton } from '@/components/shared/form-skelton';

export default function Loading() {
  return (
    <FormSkelton
      fields={[
        { labelWidth: 'w-16', inputHeight: 'h-10' }, // Name
        { labelWidth: 'w-12', inputHeight: 'h-10' }, // Slug
        { labelWidth: 'w-20', inputHeight: 'h-32', isTextarea: true }, // Description
        { labelWidth: 'w-16', inputHeight: 'h-24' }, // Image upload
      ]}
      showPageHeader={true}
      showBackButton={true}
      showSubmitButton={true}
      submitAlign="right"
    />
  );
}
