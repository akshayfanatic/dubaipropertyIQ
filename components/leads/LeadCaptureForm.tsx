'use client';

import { Mail, MessageSquareText, Phone, Send, User } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';
import BaseForm from '@/components/shared/forms/BaseForm';
import { TextInput } from '@/components/shared/forms/text-input';
import { TextArea } from '@/components/shared/forms/text-area';
import { SelectField } from '@/components/shared/select-field';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { createLead } from '@/lib/db/leads/actions';
import type { LeadSourceType } from '@/types/lead';
import type { SelectOption } from '@/types/shared';

const defaultBudgetOptions: SelectOption[] = [
  { label: 'Under AED 1M', value: 'Under AED 1M' },
  { label: 'AED 1M to 2M', value: 'AED 1M to 2M' },
  { label: 'AED 2M to 5M', value: 'AED 2M to 5M' },
  { label: 'AED 5M+', value: 'AED 5M+' },
];

const timelineOptions: SelectOption[] = [
  { label: 'Immediately', value: 'Immediately' },
  { label: 'Within 3 months', value: 'Within 3 months' },
  { label: '3 to 6 months', value: '3 to 6 months' },
  { label: 'Researching only', value: 'Researching only' },
];

const leadCaptureSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().email('Enter a valid email address'),
  phone: z.string().trim().optional(),
  nationality: z.string().trim().optional(),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  message: z.string().trim().max(700, 'Message must be under 700 characters').optional(),
});

type LeadCaptureFormData = z.infer<typeof leadCaptureSchema>;

type LeadCaptureFormProps = {
  sourceType: LeadSourceType;
  areaOfInterest?: string;
  showPhone?: boolean;
  requirePhone?: boolean;
  showNationality?: boolean;
  showBudget?: boolean;
  requireBudget?: boolean;
  budgetOptions?: SelectOption[];
  showTimeline?: boolean;
  requireTimeline?: boolean;
  showMessage?: boolean;
  buttonLabel?: string;
  successMessage?: string;
  idPrefix?: string;
};

const defaultValues: LeadCaptureFormData = {
  name: '',
  email: '',
  phone: '',
  nationality: '',
  budget: '',
  timeline: '',
  message: '',
};

function getTrackingContext() {
  if (typeof window === 'undefined') {
    return {
      source_page: '',
      utm_source: null,
      utm_medium: null,
      utm_campaign: null,
    };
  }

  const url = new URL(window.location.href);

  return {
    source_page: `${url.pathname}${url.search}`,
    utm_source: url.searchParams.get('utm_source'),
    utm_medium: url.searchParams.get('utm_medium'),
    utm_campaign: url.searchParams.get('utm_campaign'),
  };
}

function formatLeadMessage(data: LeadCaptureFormData) {
  return [`Budget: ${data.budget}`, `Timeline: ${data.timeline}`, data.message ? `Message: ${data.message}` : null].filter(Boolean).join('\n');
}

export function LeadCaptureForm({
  sourceType,
  areaOfInterest,
  showPhone = false,
  requirePhone = false,
  showNationality = false,
  showBudget = false,
  requireBudget = false,
  budgetOptions = defaultBudgetOptions,
  showTimeline = false,
  requireTimeline = false,
  showMessage = false,
  buttonLabel = 'Send inquiry',
  successMessage = 'Inquiry sent successfully',
  idPrefix = 'lead',
}: LeadCaptureFormProps) {
  const onSubmit = async (data: LeadCaptureFormData, form: { reset: (values: LeadCaptureFormData) => void }) => {
    if (requirePhone && !data.phone) {
      toast.error('Enter a valid phone number');
      return;
    }

    if (requireBudget && !data.budget) {
      toast.error('Select a budget range');
      return;
    }

    if (requireTimeline && !data.timeline) {
      toast.error('Select a timeline');
      return;
    }

    const tracking = getTrackingContext();
    const result = await createLead({
      name: data.name,
      email: data.email,
      phone: data.phone,
      nationality: data.nationality,
      source_type: sourceType,
      source_page: tracking.source_page,
      area_of_interest: areaOfInterest,
      message: formatLeadMessage(data),
      utm_source: tracking.utm_source,
      utm_medium: tracking.utm_medium,
      utm_campaign: tracking.utm_campaign,
    });

    if (!result.success) {
      toast.error(result.message || 'Failed to send inquiry');
      return;
    }

    toast.success(successMessage);
    form.reset(defaultValues);
  };

  return (
    <BaseForm schema={leadCaptureSchema} onSubmit={onSubmit} defaultValues={defaultValues} className="space-y-4">
      {(form) => (
        <>
          <div className="space-y-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field, fieldState }) => <TextInput icon={User} id={`${idPrefix}-name`} label="Name" required placeholder="Your name" error={fieldState.error?.message} {...field} />}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <TextInput icon={Mail} id={`${idPrefix}-email`} label="Email" required type="email" placeholder="name@example.com" error={fieldState.error?.message} {...field} />
              )}
            />

            {showPhone && (
              <FormField
                control={form.control}
                name="phone"
                render={({ field, fieldState }) => (
                  <TextInput icon={Phone} id={`${idPrefix}-phone`} label="Phone" required={requirePhone} type="tel" placeholder="+971 50 000 0000" error={fieldState.error?.message} {...field} />
                )}
              />
            )}

            {showNationality && (
              <FormField
                control={form.control}
                name="nationality"
                render={({ field, fieldState }) => <TextInput id={`${idPrefix}-nationality`} label="Nationality" placeholder="Your nationality" error={fieldState.error?.message} {...field} />}
              />
            )}

            {showBudget && (
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget {requireBudget && <span className="text-destructive">*</span>}</FormLabel>
                    <FormControl>
                      <SelectField options={budgetOptions} placeholder="Select budget" value={field.value} onValueChange={field.onChange} className="h-11 bg-background" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {showTimeline && (
              <FormField
                control={form.control}
                name="timeline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Timeline {requireTimeline && <span className="text-destructive">*</span>}</FormLabel>
                    <FormControl>
                      <SelectField options={timelineOptions} placeholder="Select timeline" value={field.value} onValueChange={field.onChange} className="h-11 bg-background" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {showMessage && (
              <FormField
                control={form.control}
                name="message"
                render={({ field, fieldState }) => (
                  <TextArea icon={MessageSquareText} id={`${idPrefix}-message`} label="Message" rows={3} placeholder="Tell us what you want to know." error={fieldState.error?.message} {...field} />
                )}
              />
            )}
          </div>

          <Button type="submit" disabled={form.formState.isSubmitting} className="h-11 w-full cursor-pointer">
            <Send className="size-4" />
            {form.formState.isSubmitting ? 'Sending...' : buttonLabel}
          </Button>
        </>
      )}
    </BaseForm>
  );
}
