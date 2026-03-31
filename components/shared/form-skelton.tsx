import React from 'react';
import { Skeleton } from '../ui/skeleton';

interface SkeletonFieldConfig {
  labelWidth?: string;
  inputHeight?: string;
  isTextarea?: boolean;
}

interface FormSkeltonProps {
  /** Number of fields or array of field configs */
  fields?: number | SkeletonFieldConfig[];
  /** Show page header with back button, title, description */
  showPageHeader?: boolean;
  /** Show back button in header */
  showBackButton?: boolean;
  /** Show submit button */
  showSubmitButton?: boolean;
  /** Submit button alignment */
  submitAlign?: 'left' | 'center' | 'right';
}

const defaultFieldConfig: SkeletonFieldConfig = {
  labelWidth: 'w-16',
  inputHeight: 'h-10',
  isTextarea: false,
};

const SkeletonField = ({ labelWidth = 'w-16', inputHeight = 'h-10', isTextarea = false }: SkeletonFieldConfig) => {
  return (
    <div className="space-y-2 w-full">
      <Skeleton className={`h-4 ${labelWidth}`} />
      <Skeleton className={`${isTextarea ? 'h-24' : inputHeight} w-full`} />
    </div>
  );
};

export const FormSkelton = ({ fields = 4, showPageHeader = true, showBackButton = true, showSubmitButton = true, submitAlign = 'right' }: FormSkeltonProps) => {
  // Convert number to array of default configs, or use provided configs
  const fieldConfigs: SkeletonFieldConfig[] = typeof fields === 'number' ? Array(fields).fill(defaultFieldConfig) : fields;

  const submitAlignClass = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  }[submitAlign];

  return (
    <div className="space-y-6">
      {/* PageHeader skeleton */}
      {showPageHeader && (
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            {showBackButton && <Skeleton className="h-9 w-9 rounded-md" />}
            <Skeleton className="h-9 w-32" />
          </div>
          <Skeleton className="h-5 w-48" />
        </div>
      )}

      {/* Form card skeleton */}
      <div className="rounded-lg border bg-card p-6 flex flex-col">
        <div className="space-y-6">
          {fieldConfigs.map((field, index) => (
            <SkeletonField key={index} {...field} />
          ))}

          {/* Submit button */}
          {showSubmitButton && (
            <div className={`pt-4 w-full flex ${submitAlignClass}`}>
              <Skeleton className="h-10 w-32" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
