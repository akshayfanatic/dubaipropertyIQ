'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Save } from 'lucide-react';
import type { z } from 'zod';
import BaseForm from '@/components/shared/forms/BaseForm';
import { SelectField } from '@/components/shared/select-field';
import { WidgetCard } from '@/components/shared/WidgetCard';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { PARTNER_APPLICATION_STATUS_OPTIONS } from '@/config/application';
import { updateAgentApplicationReviewAdmin } from '@/lib/db/partner-applications/actions';
import { partnerApplicationReviewSchema } from '@/lib/validations/partner-application';
import type { PartnerApplicationWithAgentDetails } from '@/types/partner-application';

type ReviewFormData = z.infer<typeof partnerApplicationReviewSchema>;

export function AgentApplicationReviewForm({ application }: { application: PartnerApplicationWithAgentDetails }) {
  const router = useRouter();

  const defaultValues = {
    status: application.status,
    admin_notes: application.admin_notes || '',
  };

  const onSubmit = async (data: ReviewFormData) => {
    const result = await updateAgentApplicationReviewAdmin(application.id, data);

    if (!result.success) {
      toast.error(result.message || 'Failed to update application');
      return;
    }

    toast.success('Application review updated');
    router.refresh();
  };

  return (
    <WidgetCard title="Submit" description="Update status and save internal notes for this application." className="shadow-sm">
      <BaseForm schema={partnerApplicationReviewSchema} onSubmit={onSubmit} defaultValues={defaultValues} className="space-y-4">
        {(form) => (
          <>
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Application status</FormLabel>
                  <FormControl>
                    <SelectField options={PARTNER_APPLICATION_STATUS_OPTIONS} placeholder="Select status" value={field.value} onValueChange={field.onChange} className="h-11" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="admin_notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admin notes</FormLabel>
                  <FormControl>
                    <Textarea rows={5} placeholder="Internal review notes." value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur} name={field.name} ref={field.ref} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={form.formState.isSubmitting} className="w-full cursor-pointer">
              <Save className="mr-2 h-4 w-4" />
              {form.formState.isSubmitting ? 'Saving...' : 'Save Review'}
            </Button>
          </>
        )}
      </BaseForm>
    </WidgetCard>
  );
}
