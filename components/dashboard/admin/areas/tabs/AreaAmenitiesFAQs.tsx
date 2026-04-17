'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { FormActions } from '@/components/shared/forms/FormActions';
import { FAQTab } from '@/components/shared/forms/FAQTab';
import { areaFAQSchema } from '@/lib/validations/area';
import { toast } from 'sonner';
import { saveAreaAmenitiesFAQs } from '@/lib/db/areas/actions';
import { WidgetCard } from '@/components/shared/WidgetCard';

interface AreaAmenitiesFAQsProps {
  areaId?: string;
  faqs?: Array<{ id: string; question: string; answer: string }>;
}

const amenitiesFaqsFormSchema = z.object({
  amenities_faqs: z.array(areaFAQSchema),
});

type AmenitiesFaqsFormData = z.infer<typeof amenitiesFaqsFormSchema>;

export default function AreaAmenitiesFAQs({ areaId, faqs = [] }: AreaAmenitiesFAQsProps) {
  const isEditMode = !!areaId;

  const form = useForm<AmenitiesFaqsFormData>({
    resolver: zodResolver(amenitiesFaqsFormSchema),
    defaultValues: {
      amenities_faqs: [],
    },
  });

  // Load FAQs into form when available
  useEffect(() => {
    if (faqs && faqs.length > 0) {
      form.reset({ amenities_faqs: faqs });
    }
  }, [faqs, form]);

  const onSubmit = async (data: AmenitiesFaqsFormData) => {
    if (!areaId) {
      toast.error('Please save the area basic info first');
      return;
    }

    const result = await saveAreaAmenitiesFAQs(areaId, data.amenities_faqs);

    if (!result.success) {
      toast.error(result.message || 'Failed to save Amenities FAQs');
      return;
    }

    toast.success('Amenities FAQs saved successfully');
  };

  return (
    <WidgetCard className="p-0">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FAQTab
          control={form.control}
          form={form}
          name={'amenities_faqs' as never}
          title="Amenities FAQs"
          description="Add frequently asked questions about amenities in this area"
          addButtonText="Add Amenity FAQ"
          emptyMessage='No Amenities FAQs added yet. Click "Add Amenity FAQ" to create one.'
          questionPlaceholder="e.g., What schools are available in this area?"
          answerPlaceholder="Provide a detailed answer about amenities..."
        />
        <FormActions isSubmitting={form.formState.isSubmitting} isEditMode={isEditMode} submitLabel="Amenities FAQs" />
      </form>
    </WidgetCard>
  );
}
