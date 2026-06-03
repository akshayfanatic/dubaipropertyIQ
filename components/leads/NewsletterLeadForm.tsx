'use client';

import { CheckCircle2, Mail, Send } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import BaseForm from '@/components/shared/forms/BaseForm';
import { TextInput } from '@/components/shared/forms/text-input';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form';
import { createLead } from '@/lib/db/leads/actions';

const newsletterSchema = z.object({
  email: z.string().trim().email('Enter a valid email address'),
});

type NewsletterFormData = z.infer<typeof newsletterSchema>;

const defaultValues: NewsletterFormData = {
  email: '',
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

export function NewsletterLeadForm() {
  const [subscribedEmail, setSubscribedEmail] = useState<string | null>(null);

  const onSubmit = async (data: NewsletterFormData, form: { reset: (values: NewsletterFormData) => void }) => {
    const tracking = getTrackingContext();
    const result = await createLead({
      name: data.email,
      email: data.email,
      source_type: 'newsletter',
      source_page: tracking.source_page,
      area_of_interest: 'Homepage newsletter',
      message: 'Subscribed to weekly Dubai property insights.',
      utm_source: tracking.utm_source,
      utm_medium: tracking.utm_medium,
      utm_campaign: tracking.utm_campaign,
    });

    if (!result.success) {
      toast.error(result.message || 'Failed to subscribe');
      return;
    }

    setSubscribedEmail(data.email);
    toast.success('You are subscribed to weekly insights');
    form.reset(defaultValues);
  };

  if (subscribedEmail) {
    return (
      <div className="animate-in fade-in-0 zoom-in-95 grid gap-4 rounded-2xl border border-primary/20 bg-primary/10 p-5 duration-500">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
            <CheckCircle2 className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="font-extrabold text-foreground">You are on the list.</p>
            <p className="mt-1 break-words text-sm leading-6 text-muted-foreground">Weekly Dubai property insights will go to {subscribedEmail}.</p>
          </div>
        </div>
        <Button type="button" variant="outline" className="h-11 rounded-xl bg-background" onClick={() => setSubscribedEmail(null)}>
          Use another email
        </Button>
      </div>
    );
  }

  return (
    <BaseForm schema={newsletterSchema} onSubmit={onSubmit} defaultValues={defaultValues} className="grid gap-3">
      {(form) => (
        <>
          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <TextInput
                icon={Mail}
                id="home-newsletter-email"
                label="Email address"
                required
                type="email"
                placeholder="you@example.com"
                error={fieldState.error?.message}
                className="h-12 rounded-xl"
                {...field}
              />
            )}
          />
          <Button type="submit" disabled={form.formState.isSubmitting} className="h-12 justify-between rounded-xl px-4 font-bold">
            {form.formState.isSubmitting ? 'Subscribing...' : 'Send weekly insights'}
            <Send className="size-4" />
          </Button>
        </>
      )}
    </BaseForm>
  );
}
