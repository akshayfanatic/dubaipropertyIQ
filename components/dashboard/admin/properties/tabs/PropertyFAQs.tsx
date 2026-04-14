'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { FormActions } from '@/components/shared/forms/FormActions';
import { FAQTab } from '@/components/shared/forms/FAQTab';
import { faqSchema } from '@/lib/validations/shared';
import { toast } from 'sonner';
import { savePropertyFAQs } from '@/lib/db/properties/actions';

interface PropertyFAQsProps {
  propertyId?: string;
  faqs?: Array<{ id: string; question: string; answer: string }>;
}

const faqsFormSchema = z.object({
  faqs: z.array(faqSchema),
});

type FaqsFormData = z.infer<typeof faqsFormSchema>;

export default function PropertyFAQs({ propertyId, faqs = [] }: PropertyFAQsProps) {
  const isEditMode = !!propertyId;

  const form = useForm<FaqsFormData>({
    resolver: zodResolver(faqsFormSchema),
    defaultValues: {
      faqs: [],
    },
  });

  // Load FAQs into form when available
  useEffect(() => {
    if (faqs && faqs.length > 0) {
      form.reset({ faqs });
    }
  }, [faqs, form]);

  const onSubmit = async (data: FaqsFormData) => {
    if (!propertyId) {
      toast.error('Please save the property basic info first');
      return;
    }

    const result = await savePropertyFAQs(propertyId, data.faqs);

    if (!result.success) {
      toast.error(result.message || 'Failed to save FAQs');
      return;
    }

    toast.success('FAQs saved successfully');
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FAQTab
        control={form.control}
        form={form}
        name={'faqs' as never}
        title="Property FAQs"
        description="Add frequently asked questions about this property"
        addButtonText="Add FAQ"
        emptyMessage='No FAQs added yet. Click "Add FAQ" to create one.'
        questionPlaceholder="e.g., What is the payment plan for this property?"
        answerPlaceholder="Provide a detailed answer..."
      />
      <FormActions isSubmitting={form.formState.isSubmitting} isEditMode={isEditMode} submitLabel="FAQs" />
    </form>
  );
}
