'use client';

import { Download, Mail, User } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';
import BaseForm from '@/components/shared/forms/BaseForm';
import { TextInput } from '@/components/shared/forms/text-input';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form';
import { downloadBlob, getResponseDownloadFileName } from '@/lib/utils/download';
import { getBrowserTrackingContext } from '@/lib/utils/tracking';

const buildingReportSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().email('Enter a valid email address'),
});

type BuildingReportFormData = z.infer<typeof buildingReportSchema>;

type BuildingReportLeadFormProps = {
  buildingName: string;
  citySlug: string;
  areaSlug: string;
  buildingSlug: string;
};

const defaultValues: BuildingReportFormData = {
  name: '',
  email: '',
};

// Captures lead details before requesting the server-generated building PDF report.
export function BuildingReportLeadForm({ buildingName, citySlug, areaSlug, buildingSlug }: BuildingReportLeadFormProps) {
  const onSubmit = async (data: BuildingReportFormData, form: { reset: (values: BuildingReportFormData) => void }) => {
    const tracking = getBrowserTrackingContext();
    const response = await fetch('/api/buildings/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        citySlug,
        areaSlug,
        buildingSlug,
        ...tracking,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      toast.error(error?.message || 'Failed to download building report');
      return;
    }

    const blob = await response.blob();
    downloadBlob(blob, getResponseDownloadFileName(response, buildingName));
    toast.success(`${buildingName} report downloaded`);
    form.reset(defaultValues);
  };

  return (
    <BaseForm schema={buildingReportSchema} onSubmit={onSubmit} defaultValues={defaultValues} className="grid gap-4">
      {(form) => (
        <>
          <div className="grid gap-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field, fieldState }) => <TextInput icon={User} id="building-report-name" label="Name" required placeholder="Your name" error={fieldState.error?.message} {...field} />}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <TextInput icon={Mail} id="building-report-email" label="Email" required type="email" placeholder="name@example.com" error={fieldState.error?.message} {...field} />
              )}
            />
          </div>
          <div className="flex flex-col gap-3 rounded-2xl bg-muted/50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium leading-6 text-muted-foreground">Get the full {buildingName} report as a PDF.</p>
            <Button type="submit" disabled={form.formState.isSubmitting} className="h-11 rounded-xl">
              <Download className="size-4" />
              {form.formState.isSubmitting ? 'Preparing...' : 'Download PDF Report'}
            </Button>
          </div>
        </>
      )}
    </BaseForm>
  );
}
