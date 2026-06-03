'use client';

import { CheckCircle2, Mail, MessageSquareText, Phone, Send, User } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

import BaseForm from '@/components/shared/forms/BaseForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { SelectField } from '@/components/shared/select-field';
import { TextArea } from '@/components/shared/forms/text-area';
import { TextInput } from '@/components/shared/forms/text-input';
import { createLead } from '@/lib/db/leads/actions';
import type { SelectOption } from '@/types/shared';

const budgetOptions: SelectOption[] = [
  { label: 'Under AED 1M', value: 'under_1m' },
  { label: 'AED 1M to 2M', value: '1m_2m' },
  { label: 'AED 2M to 5M', value: '2m_5m' },
  { label: 'AED 5M+', value: '5m_plus' },
];

const timelineOptions: SelectOption[] = [
  { label: 'Immediately', value: 'immediately' },
  { label: 'Within 3 months', value: 'within_3_months' },
  { label: '3 to 6 months', value: '3_to_6_months' },
  { label: 'Researching only', value: 'researching' },
];

const inquiryImageUrl = 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1200&auto=format&fit=crop';

const developerInquirySchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().email('Enter a valid email address'),
  phone: z.string().trim().min(7, 'Enter a valid phone number'),
  budget: z.string().min(1, 'Select a budget range'),
  timeline: z.string().min(1, 'Select a buying timeline'),
  message: z.string().trim().max(500, 'Message must be under 500 characters').optional(),
  consent: z.boolean().refine((value) => value, 'Consent is required'),
});

type DeveloperInquiryFormData = z.infer<typeof developerInquirySchema>;

type DeveloperInquiryFormProps = {
  developerName: string;
};

const getDefaultValues = (): DeveloperInquiryFormData => ({
  name: '',
  email: '',
  phone: '',
  budget: '',
  timeline: '',
  message: '',
  consent: false,
});

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

function formatDeveloperMessage(data: DeveloperInquiryFormData) {
  return [`Budget: ${data.budget}`, `Timeline: ${data.timeline}`, data.message ? `Message: ${data.message}` : null].filter(Boolean).join('\n');
}

export function DeveloperInquiryForm({ developerName }: DeveloperInquiryFormProps) {
  const [submittedName, setSubmittedName] = useState<string | null>(null);

  const onSubmit = async (data: DeveloperInquiryFormData, form: { reset: (values: DeveloperInquiryFormData) => void }) => {
    const tracking = getTrackingContext();
    const result = await createLead({
      name: data.name,
      email: data.email,
      phone: data.phone,
      source_type: 'developer',
      source_page: tracking.source_page,
      area_of_interest: developerName,
      message: formatDeveloperMessage(data),
      utm_source: tracking.utm_source,
      utm_medium: tracking.utm_medium,
      utm_campaign: tracking.utm_campaign,
    });

    if (!result.success) {
      toast.error(result.message || 'Failed to send inquiry');
      return;
    }

    setSubmittedName(data.name);
    toast.success(`Developer information request sent for ${developerName}.`);
    form.reset(getDefaultValues());
  };

  if (submittedName) {
    return (
      <div className="overflow-hidden rounded-[22px] border border-primary/20 bg-card shadow-[0_18px_50px_oklch(0.2_0.03_263.61_/_0.12)]">
        <div className="grid lg:grid-cols-[0.88fr_1.12fr]">
          <div className="relative hidden min-h-72 overflow-hidden bg-muted sm:block lg:min-h-full">
            <ImageWithFallback src={inquiryImageUrl} alt={`${developerName} Dubai property inquiry`} fill className="object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,oklch(0.2_0.03_263.61_/_0.05),oklch(0.2_0.03_263.61_/_0.72))]" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-primary-foreground">
              <Badge variant="outline" className="mb-4 rounded-md border-primary-foreground/30 bg-background/15 text-primary-foreground backdrop-blur-sm">
                Request received
              </Badge>
              <h3 className="max-w-sm text-2xl font-semibold tracking-tight">Developer information is on the way.</h3>
            </div>
          </div>

          <div className="grid min-h-80 place-items-center p-6 md:p-10">
            <div className="max-w-md text-center">
              <span className="mx-auto grid size-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                <CheckCircle2 className="size-7" />
              </span>
              <h3 className="mt-5 text-2xl font-extrabold tracking-tight text-foreground">Thank you, {submittedName}.</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">We captured your request for {developerName}. Our team will share availability, price context, and matching projects.</p>
              <Button type="button" variant="outline" className="mt-6 h-11 rounded-xl bg-background" onClick={() => setSubmittedName(null)}>
                Send another request
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <BaseForm
      schema={developerInquirySchema}
      onSubmit={onSubmit}
      defaultValues={getDefaultValues()}
      className="overflow-hidden rounded-[22px] border border-border bg-card shadow-[0_18px_50px_oklch(0.2_0.03_263.61_/_0.12)]"
    >
      {(form) => (
        <div className="grid lg:grid-cols-[0.88fr_1.12fr]">
          <div className="hidden sm:block relative min-h-72 overflow-hidden border-b bg-muted lg:min-h-full lg:border-b-0 lg:border-r">
            <ImageWithFallback src={inquiryImageUrl} alt={`${developerName} Dubai property inquiry`} fill className="object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,oklch(0.2_0.03_263.61_/_0.08),oklch(0.2_0.03_263.61_/_0.76))]" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-primary-foreground md:p-6">
              <Badge variant="outline" className="mb-4 rounded-md border-primary-foreground/30 bg-background/15 text-primary-foreground backdrop-blur-sm">
                Developer information
              </Badge>
              <div className="space-y-2">
                <h3 className="max-w-sm text-2xl font-semibold tracking-tight">Get developer information</h3>
                <p className="max-w-sm text-sm leading-6 text-primary-foreground/85">Share your buying profile and get availability, pricing context, and matching projects from {developerName}.</p>
              </div>
            </div>
          </div>

          <div className="p-4 md:p-6">
            <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
              <FormField
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <TextInput
                    icon={User}
                    id="developer-inquiry-name"
                    label="Full name"
                    required
                    type="text"
                    placeholder="Your name"
                    className="h-11 bg-background"
                    error={fieldState.error?.message}
                    {...field}
                  />
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <TextInput
                    icon={Mail}
                    id="developer-inquiry-email"
                    label="Email"
                    required
                    type="email"
                    placeholder="name@example.com"
                    className="h-11 bg-background"
                    error={fieldState.error?.message}
                    {...field}
                  />
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field, fieldState }) => (
                  <TextInput
                    icon={Phone}
                    id="developer-inquiry-phone"
                    label="Phone"
                    required
                    type="tel"
                    placeholder="+971 50 000 0000"
                    className="h-11 bg-background"
                    error={fieldState.error?.message}
                    {...field}
                  />
                )}
              />

              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Budget range <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <SelectField options={budgetOptions} placeholder="Select budget" value={field.value} onValueChange={field.onChange} className="h-11 bg-background" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="timeline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Buying timeline <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <SelectField options={timelineOptions} placeholder="Select timeline" value={field.value} onValueChange={field.onChange} className="h-11 bg-background" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field, fieldState }) => (
                  <div className="lg:col-span-2">
                    <TextArea
                      icon={MessageSquareText}
                      id="developer-inquiry-message"
                      label="Message"
                      rows={4}
                      placeholder={`Optional notes about ${developerName}, preferred units, or investment goals.`}
                      className="min-h-28 resize-none bg-background"
                      error={fieldState.error?.message}
                      {...field}
                    />
                  </div>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="consent"
              render={({ field }) => (
                <FormItem className="mt-5 flex items-start gap-3 rounded-md border bg-muted/20 p-3">
                  <FormControl>
                    <Input id="developer-inquiry-consent" type="checkbox" className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer" checked={field.value} onChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1">
                    <FormLabel>I agree to be contacted about this developer and related properties.</FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <div className="mt-6 flex flex-col gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-xl text-sm leading-6 text-muted-foreground">Your request helps narrow availability before a call. Required fields are marked.</p>
              <Button type="submit" disabled={form.formState.isSubmitting} className="h-11 w-full cursor-pointer sm:w-auto">
                <Send />
                {form.formState.isSubmitting ? 'Sending...' : 'Get developer information'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </BaseForm>
  );
}
