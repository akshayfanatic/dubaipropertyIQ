'use client';

import { CheckCircle2, Mail, MessageSquareText, Phone, Send, User } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import BaseForm from '@/components/shared/forms/BaseForm';
import { TextArea } from '@/components/shared/forms/text-area';
import { TextInput } from '@/components/shared/forms/text-input';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form';
import { createLead } from '@/lib/db/leads/actions';

const contactLeadSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().email('Enter a valid email address'),
  phone: z.string().trim().optional(),
  message: z.string().trim().min(5, 'Message must be at least 5 characters').max(900, 'Message must be under 900 characters'),
});

type ContactLeadFormData = z.infer<typeof contactLeadSchema>;

const defaultValues: ContactLeadFormData = {
  name: '',
  email: '',
  phone: '',
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

export function ContactLeadForm() {
  const [submittedName, setSubmittedName] = useState<string | null>(null);

  const onSubmit = async (data: ContactLeadFormData, form: { reset: (values: ContactLeadFormData) => void }) => {
    const tracking = getTrackingContext();
    const result = await createLead({
      name: data.name,
      email: data.email,
      phone: data.phone,
      source_type: 'callback',
      source_page: tracking.source_page,
      area_of_interest: 'Contact page',
      message: data.message,
      utm_source: tracking.utm_source,
      utm_medium: tracking.utm_medium,
      utm_campaign: tracking.utm_campaign,
    });

    if (!result.success) {
      toast.error(result.message || 'Failed to send message');
      return;
    }

    setSubmittedName(data.name);
    toast.success('Message sent');
    form.reset(defaultValues);
  };

  if (submittedName) {
    return (
      <div className="rounded-[18px] border border-primary/20 bg-primary/10 p-6">
        <div className="flex items-start gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
            <CheckCircle2 className="size-5" />
          </span>
          <div>
            <p className="font-extrabold text-foreground">Message received, {submittedName}.</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">Our team will review your request and follow up.</p>
          </div>
        </div>
        <Button type="button" variant="outline" className="mt-5 h-11 rounded-xl bg-background" onClick={() => setSubmittedName(null)}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <BaseForm schema={contactLeadSchema} onSubmit={onSubmit} defaultValues={defaultValues} className="grid gap-4">
      {(form) => (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field, fieldState }) => <TextInput icon={User} id="contact-name" label="Name" required placeholder="Your name" error={fieldState.error?.message} {...field} />}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <TextInput icon={Mail} id="contact-email" label="Email" required type="email" placeholder="name@example.com" error={fieldState.error?.message} {...field} />
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="phone"
            render={({ field, fieldState }) => <TextInput icon={Phone} id="contact-phone" label="Phone" type="tel" placeholder="+971 50 000 0000" error={fieldState.error?.message} {...field} />}
          />
          <FormField
            control={form.control}
            name="message"
            render={({ field, fieldState }) => (
              <TextArea icon={MessageSquareText} id="contact-message" label="Message" required rows={5} placeholder="Tell us how we can help." error={fieldState.error?.message} {...field} />
            )}
          />
          <Button type="submit" disabled={form.formState.isSubmitting} className="h-11 w-full rounded-xl sm:w-fit">
            <Send className="size-4" />
            {form.formState.isSubmitting ? 'Sending...' : 'Send Message'}
          </Button>
        </>
      )}
    </BaseForm>
  );
}
