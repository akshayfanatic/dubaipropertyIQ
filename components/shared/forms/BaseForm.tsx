'use client';

import { useForm, FormProvider, type DefaultValues, type FieldValues, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';

type InferFormValues<T extends z.ZodType> = z.infer<T> extends FieldValues ? z.infer<T> : FieldValues;

type BaseFormProps<T extends z.ZodType> = {
  schema: T;
  onSubmit: (data: InferFormValues<T>, form: UseFormReturn<InferFormValues<T>>) => void | Promise<void>;
  children: React.ReactNode | ((form: UseFormReturn<InferFormValues<T>>) => React.ReactNode);
  className?: string;
  defaultValues?: DefaultValues<InferFormValues<T>>;
  mode?: 'onBlur' | 'onChange' | 'onSubmit' | 'all' | 'onTouched';
};

// Zod schemas always produce objects, satisfy FieldValues at runtime
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function BaseForm<T extends z.ZodType<any, any, any>>({ schema, onSubmit, children, className, defaultValues, mode = 'onSubmit' }: BaseFormProps<T>) {
  type FormValues = InferFormValues<T>;

  const form = useForm({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any,
    defaultValues,
    mode,
  });

  const content = typeof children === 'function' ? (children as (form: UseFormReturn<FormValues>) => React.ReactNode)(form as UseFormReturn<FormValues>) : children;

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit((data) => onSubmit(data as FormValues, form as UseFormReturn<FormValues>))} className={className}>
        {content}
      </form>
    </FormProvider>
  );
}
