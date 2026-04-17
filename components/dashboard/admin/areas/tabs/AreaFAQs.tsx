'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { FormActions } from '@/components/shared/forms/FormActions';
import { FAQTab } from '@/components/shared/forms/FAQTab';
import { areaFAQSchema } from '@/lib/validations/area';
import { toast } from 'sonner';
import { saveAreaFAQs } from '@/lib/db/areas/actions';
import { WidgetCard } from '@/components/shared/WidgetCard';

interface AreaFAQsProps {
  areaId?: string;
  faqs?: Array<{ id: string; question: string; answer: string }>;
}

const faqsFormSchema = z.object({
  faqs: z.array(areaFAQSchema),
});

type FaqsFormData = z.infer<typeof faqsFormSchema>;

export default function AreaFAQs({ areaId, faqs = [] }: AreaFAQsProps) {
  const isEditMode = !!areaId;

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
    if (!areaId) {
      toast.error('Please save the area basic info first');
      return;
    }

    const result = await saveAreaFAQs(areaId, data.faqs);

    if (!result.success) {
      toast.error(result.message || 'Failed to save FAQs');
      return;
    }

    toast.success('FAQs saved successfully');
  };

  return (
    <WidgetCard className="px-0 pt-0 pb">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FAQTab
          control={form.control}
          form={form}
          name={'faqs' as never}
          title="Area FAQs"
          description="Add frequently asked questions about this area"
          addButtonText="Add FAQ"
          emptyMessage='No FAQs added yet. Click "Add FAQ" to create one.'
          questionPlaceholder="e.g., What is the average rental yield in Downtown Dubai?"
          answerPlaceholder="Provide a detailed answer..."
        />
        <FormActions isSubmitting={form.formState.isSubmitting} isEditMode={isEditMode} submitLabel="FAQs" />
      </form>
    </WidgetCard>
  );
}
