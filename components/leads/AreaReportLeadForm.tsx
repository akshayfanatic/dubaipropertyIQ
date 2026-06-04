'use client';

import { CheckCircle2, Download, Mail, MapPin, User } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import BaseForm from '@/components/shared/forms/BaseForm';
import { TextInput } from '@/components/shared/forms/text-input';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form';
import { createLead } from '@/lib/db/leads/actions';

const areaReportSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().email('Enter a valid email address'),
});

type AreaReportFormData = z.infer<typeof areaReportSchema>;

type AreaReportLeadFormProps = {
  areaName: string;
};

const defaultValues: AreaReportFormData = {
  name: '',
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

export function AreaReportLeadForm({ areaName }: AreaReportLeadFormProps) {
  const [unlockedEmail, setUnlockedEmail] = useState<string | null>(null);

  const onSubmit = async (data: AreaReportFormData, form: { reset: (values: AreaReportFormData) => void }) => {
    const tracking = getTrackingContext();
    const result = await createLead({
      name: data.name,
      email: data.email,
      source_type: 'area',
      source_page: tracking.source_page,
      area_of_interest: areaName,
      message: `Requested downloadable area report for ${areaName}.`,
      utm_source: tracking.utm_source,
      utm_medium: tracking.utm_medium,
      utm_campaign: tracking.utm_campaign,
    });

    if (!result.success) {
      toast.error(result.message || 'Failed to request area report');
      return;
    }

    setUnlockedEmail(data.email);
    toast.success(`${areaName} report request captured`);
    form.reset(defaultValues);
  };

  if (unlockedEmail) {
    return (
      <div className="rounded-2xl border border-primary/20 bg-primary/10 p-5">
        <div className="flex items-start gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
            <CheckCircle2 className="size-5" />
          </span>
          <div>
            <p className="font-extrabold text-foreground">Area report request received.</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              We captured {unlockedEmail} for the {areaName} report.
            </p>
          </div>
        </div>
        <Button type="button" variant="outline" className="mt-5 h-11 rounded-xl bg-background" onClick={() => setUnlockedEmail(null)}>
          Request for another email
        </Button>
      </div>
    );
  }

  return (
    <BaseForm schema={areaReportSchema} onSubmit={onSubmit} defaultValues={defaultValues} className="grid gap-4">
      {(form) => (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field, fieldState }) => <TextInput icon={User} id="area-report-name" label="Name" required placeholder="Your name" error={fieldState.error?.message} {...field} />}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <TextInput icon={Mail} id="area-report-email" label="Email" required type="email" placeholder="name@example.com" error={fieldState.error?.message} {...field} />
              )}
            />
          </div>
          <div className="flex flex-col gap-3 rounded-2xl bg-muted/50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
              <MapPin className="size-4 text-primary" />
              {areaName} investment report
            </div>
            <Button type="submit" disabled={form.formState.isSubmitting} className="h-11 rounded-xl">
              <Download className="size-4" />
              {form.formState.isSubmitting ? 'Requesting...' : 'Download Area Report'}
            </Button>
          </div>
        </>
      )}
    </BaseForm>
  );
}
