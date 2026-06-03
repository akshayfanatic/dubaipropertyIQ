'use client';

import { CheckCircle2, FileText, Mail, Send, User } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import BaseForm from '@/components/shared/forms/BaseForm';
import { TextArea } from '@/components/shared/forms/text-area';
import { TextInput } from '@/components/shared/forms/text-input';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form';
import { createLead } from '@/lib/db/leads/actions';

const calculatorReportSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().email('Enter a valid email address'),
  preferences: z.string().trim().max(700, 'Preferences must be under 700 characters').optional(),
});

type CalculatorReportFormData = z.infer<typeof calculatorReportSchema>;

type CalculatorReportLeadFormProps = {
  calculatorName: string;
};

const defaultValues: CalculatorReportFormData = {
  name: '',
  email: '',
  preferences: '',
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

export function CalculatorReportLeadForm({ calculatorName }: CalculatorReportLeadFormProps) {
  const [unlockedEmail, setUnlockedEmail] = useState<string | null>(null);

  const onSubmit = async (data: CalculatorReportFormData, form: { reset: (values: CalculatorReportFormData) => void }) => {
    const tracking = getTrackingContext();
    const result = await createLead({
      name: data.name,
      email: data.email,
      source_type: 'calculator',
      source_page: tracking.source_page,
      area_of_interest: calculatorName,
      message: [`Requested detailed calculator report for ${calculatorName}.`, data.preferences ? `Preferences: ${data.preferences}` : null].filter(Boolean).join('\n'),
      utm_source: tracking.utm_source,
      utm_medium: tracking.utm_medium,
      utm_campaign: tracking.utm_campaign,
    });

    if (!result.success) {
      toast.error(result.message || 'Failed to unlock detailed report');
      return;
    }

    setUnlockedEmail(data.email);
    toast.success('Detailed report unlocked');
    form.reset(defaultValues);
  };

  if (unlockedEmail) {
    return (
      <div className="grid gap-4 rounded-[18px] border border-primary/20 bg-primary/10 p-5">
        <div className="flex items-start gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
            <CheckCircle2 className="size-5" />
          </span>
          <div>
            <p className="font-extrabold text-foreground">Detailed report unlocked.</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">We captured {unlockedEmail}. Our team can follow up with context for your numbers.</p>
          </div>
        </div>
        <div className="grid gap-2 rounded-2xl bg-background p-4 text-sm text-muted-foreground">
          <p className="font-bold text-foreground">Unlocked report includes:</p>
          <p>Financing assumptions, risk notes, and next-step property preferences.</p>
        </div>
      </div>
    );
  }

  return (
    <BaseForm schema={calculatorReportSchema} onSubmit={onSubmit} defaultValues={defaultValues} className="grid gap-4">
      {(form) => (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field, fieldState }) => <TextInput icon={User} id="calculator-report-name" label="Name" required placeholder="Your name" error={fieldState.error?.message} {...field} />}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <TextInput icon={Mail} id="calculator-report-email" label="Email" required type="email" placeholder="name@example.com" error={fieldState.error?.message} {...field} />
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="preferences"
            render={({ field, fieldState }) => (
              <TextArea
                icon={FileText}
                id="calculator-report-preferences"
                label="Property preferences"
                rows={3}
                placeholder="Budget, target area, property type, or investment goal."
                error={fieldState.error?.message}
                {...field}
              />
            )}
          />
          <Button type="submit" disabled={form.formState.isSubmitting} className="h-11 w-full rounded-xl sm:w-fit">
            <Send className="size-4" />
            {form.formState.isSubmitting ? 'Unlocking...' : 'Unlock Detailed Report'}
          </Button>
        </>
      )}
    </BaseForm>
  );
}
