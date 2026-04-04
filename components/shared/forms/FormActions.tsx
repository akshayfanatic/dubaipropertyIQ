'use client';

import { Button } from '@/components/ui/button';
import { Loader2, Save } from 'lucide-react';

interface FormActionsProps {
  isSubmitting?: boolean;
  isEditMode?: boolean;
  submitLabel?: string;
}

export function FormActions({ isSubmitting, isEditMode, submitLabel = 'Save' }: FormActionsProps) {
  return (
    <div className="flex justify-end gap-3 pt-6">
      <Button type="submit" disabled={isSubmitting} className="cursor-pointer min-w-30">
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {isEditMode ? 'Updating...' : 'Creating...'}
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            {isEditMode ? `Update ${submitLabel}` : `Create ${submitLabel}`}
          </>
        )}
      </Button>
    </div>
  );
}
