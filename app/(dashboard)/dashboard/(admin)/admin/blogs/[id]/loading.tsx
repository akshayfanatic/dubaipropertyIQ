import { FormSkelton } from '@/components/shared/form-skelton';

export default function Loading() {
  return (
    <FormSkelton
      fields={[
        { labelWidth: 'w-16', inputHeight: 'h-10' },
        { labelWidth: 'w-12', inputHeight: 'h-10' },
        { labelWidth: 'w-20', inputHeight: 'h-64', isTextarea: true },
        { labelWidth: 'w-16', inputHeight: 'h-20', isTextarea: true },
      ]}
      showPageHeader={true}
      showBackButton={true}
      showSubmitButton={true}
      submitAlign="right"
    />
  );
}
