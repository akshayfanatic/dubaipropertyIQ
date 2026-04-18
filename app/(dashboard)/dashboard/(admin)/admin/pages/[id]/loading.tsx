import { FormSkelton } from '@/components/shared/form-skelton';

export default function EditPageLoading() {
  return (
    <FormSkelton
      fields={[
        { labelWidth: 'w-16', inputHeight: 'h-10' }, // Title
        { labelWidth: 'w-12', inputHeight: 'h-10' }, // Slug
        { labelWidth: 'w-20', inputHeight: 'h-64', isTextarea: true }, // Content (TiptapEditor)
        { labelWidth: 'w-16', inputHeight: 'h-20', isTextarea: true }, // Excerpt
      ]}
      showPageHeader={true}
      showBackButton={true}
      showSubmitButton={true}
      submitAlign="right"
    />
  );
}
