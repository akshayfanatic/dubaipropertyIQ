'use client';

import { CheckCircle2, Mail, Send } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import BaseForm from '@/components/shared/forms/BaseForm';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { createLead } from '@/lib/db/leads/actions';
import { cn } from '@/lib/utils';

const blogLeadSchema = z.object({
  email: z.string().trim().email('Enter a valid email address'),
});

type BlogLeadFormData = z.infer<typeof blogLeadSchema>;

type BlogLeadFormProps = {
  blogTitle: string;
};

const defaultValues: BlogLeadFormData = {
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

export function BlogLeadForm({ blogTitle }: BlogLeadFormProps) {
  const [subscribedEmail, setSubscribedEmail] = useState<string | null>(null);

  const onSubmit = async (data: BlogLeadFormData, form: { reset: (values: BlogLeadFormData) => void }) => {
    const tracking = getTrackingContext();
    const result = await createLead({
      name: data.email,
      email: data.email,
      source_type: 'blog',
      source_page: tracking.source_page,
      area_of_interest: blogTitle,
      message: `Subscribed from blog guide: ${blogTitle}.`,
      utm_source: tracking.utm_source,
      utm_medium: tracking.utm_medium,
      utm_campaign: tracking.utm_campaign,
    });

    if (!result.success) {
      toast.error(result.message || 'Failed to subscribe');
      return;
    }

    setSubscribedEmail(data.email);
    toast.success('Guide updates subscription captured');
    form.reset(defaultValues);
  };

  if (subscribedEmail) {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/10 p-4">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
          <CheckCircle2 className="size-5" />
        </span>
        <div className="min-w-0">
          <p className="font-extrabold text-foreground">You are subscribed.</p>
          <p className="mt-1 break-words text-sm leading-6 text-muted-foreground">We captured {subscribedEmail} for guide updates.</p>
        </div>
      </div>
    );
  }

  return (
    <BaseForm schema={blogLeadSchema} onSubmit={onSubmit} defaultValues={defaultValues} className="grid gap-2 sm:min-w-100">
      {(form) => (
        <>
          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <FormItem>
                <div
                  className={cn(
                    'flex min-h-13 items-center gap-2 rounded-full border border-border bg-background px-2 shadow-sm transition-colors focus-within:border-primary/45 focus-within:ring-2 focus-within:ring-ring/25',
                    fieldState.error && 'border-destructive focus-within:border-destructive focus-within:ring-destructive/20',
                  )}
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                    <Mail className="size-4" />
                  </span>
                  <FormControl>
                    <Input
                      id="blog-guide-email"
                      type="email"
                      placeholder="Email address"
                      className="h-11 min-w-0 flex-1 border-0 bg-transparent px-0 text-sm font-medium shadow-none outline-none placeholder:text-muted-foreground focus-visible:ring-0"
                      {...field}
                    />
                  </FormControl>
                  <Button type="submit" disabled={form.formState.isSubmitting} size="sm" className="h-9 rounded-full px-4 font-bold">
                    {form.formState.isSubmitting ? 'Sending' : 'Subscribe'}
                    <Send className="size-3.5" />
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}
    </BaseForm>
  );
}
