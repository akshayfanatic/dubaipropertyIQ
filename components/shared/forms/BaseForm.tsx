'use client';

import { useForm, FormProvider, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';

type BaseFormProps<T extends z.ZodType> = {
  schema: T;
  onSubmit: (data: z.infer<T>) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: React.ReactNode | ((form: UseFormReturn<any>) => React.ReactNode);
  className?: string;
  defaultValues?: z.infer<T>;
  mode?: 'onBlur' | 'onChange' | 'onSubmit' | 'all' | 'onTouched';
};

// Zod schemas always produce objects, satisfy FieldValues at runtime
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function BaseForm<T extends z.ZodType<any, any, any>>({ schema, onSubmit, children, className, defaultValues, mode = 'onSubmit' }: BaseFormProps<T>) {
  type FormValues = z.infer<T>;

  const form = useForm({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    defaultValues: defaultValues as any,
    mode,
  });

  const content = typeof children === 'function' ? (children as (form: UseFormReturn<FormValues>) => React.ReactNode)(form as UseFormReturn<FormValues>) : children;

  return (
    <FormProvider {...form}>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <form onSubmit={form.handleSubmit(onSubmit as any)} className={className}>
        {content}
      </form>
    </FormProvider>
  );
}
