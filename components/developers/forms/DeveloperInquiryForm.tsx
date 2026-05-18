'use client';

import { Mail, MessageSquareText, Phone, Send, User } from 'lucide-react';
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

export function DeveloperInquiryForm({ developerName }: DeveloperInquiryFormProps) {
  const onSubmit = async (data: DeveloperInquiryFormData, form: { reset: (values: DeveloperInquiryFormData) => void }) => {
    await new Promise((resolve) => setTimeout(resolve, 350));
    toast.success(`Inquiry captured for ${developerName}. Thank you, ${data.name}.`);
    console.log(data);

    form.reset(getDefaultValues());
  };

  return (
    <BaseForm schema={developerInquirySchema} onSubmit={onSubmit} defaultValues={getDefaultValues()} className="overflow-hidden rounded-lg border bg-card shadow-xs">
      {(form) => (
        <div className="grid lg:grid-cols-[0.88fr_1.12fr]">
          <div className="hidden sm:block relative min-h-72 overflow-hidden border-b bg-muted lg:min-h-full lg:border-b-0 lg:border-r">
            <ImageWithFallback src={inquiryImageUrl} alt={`${developerName} Dubai property inquiry`} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/75 via-foreground/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-primary-foreground md:p-6">
              <Badge variant="outline" className="mb-4 rounded-md border-primary-foreground/30 bg-background/15 text-primary-foreground backdrop-blur-sm">
                Developer inquiry
              </Badge>
              <div className="space-y-2">
                <h3 className="max-w-sm text-2xl font-semibold tracking-tight">Request availability </h3>
                <p className="max-w-sm text-sm leading-6 text-primary-foreground/85">Share your buying profile and get a more precise view of matching inventory, pricing, and timing.</p>
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
                    type="number"
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
              <p className="max-w-xl text-sm leading-6 text-muted-foreground">Your inquiry helps narrow availability before a call. Required fields are marked.</p>
              <Button type="submit" disabled={form.formState.isSubmitting} className="h-11 w-full cursor-pointer sm:w-auto">
                <Send />
                {form.formState.isSubmitting ? 'Sending...' : 'Send inquiry'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </BaseForm>
  );
}
