import { FormSkelton } from '@/components/shared/form-skelton';

export default function Loading() {
  return (
    <FormSkelton
      fields={[
        { labelWidth: 'w-16', inputHeight: 'h-10' }, // Name
        { labelWidth: 'w-12', inputHeight: 'h-10' }, // Slug
        { labelWidth: 'w-20', inputHeight: 'h-32' }, // Logo Upload
        { labelWidth: 'w-24', inputHeight: 'h-10' }, // Website URL
        { labelWidth: 'w-20', inputHeight: 'h-24' }, // Description
        { labelWidth: 'w-36', inputHeight: 'h-10' }, // Trust Score fields (4)
        { labelWidth: 'w-36', inputHeight: 'h-10' },
        { labelWidth: 'w-36', inputHeight: 'h-10' },
        { labelWidth: 'w-36', inputHeight: 'h-10' },
        { labelWidth: 'w-28', inputHeight: 'h-10' }, // Stats (4)
        { labelWidth: 'w-28', inputHeight: 'h-10' },
        { labelWidth: 'w-28', inputHeight: 'h-10' },
        { labelWidth: 'w-28', inputHeight: 'h-10' },
      ]}
      showPageHeader={true}
      showBackButton={true}
      showSubmitButton={true}
      submitAlign="right"
    />
  );
}
