'use client';

import { useFieldArray, Control, UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { TextArea } from '@/components/shared/forms/text-area';
import { TextInput } from '@/components/shared/forms/text-input';
import { Plus, Trash2 } from 'lucide-react';

/* eslint-disable @typescript-eslint/no-explicit-any */

interface FAQTabProps {
  control: Control<any>;
  form: UseFormReturn<any>;
  name: string;
  title: string;
  description: string;
  addButtonText: string;
  emptyMessage: string;
  questionPlaceholder?: string;
  answerPlaceholder?: string;
}

export function FAQTab({
  control,
  form,
  name,
  title,
  description,
  addButtonText,
  emptyMessage,
  questionPlaceholder = 'e.g., What is the average rental yield?',
  answerPlaceholder = 'Provide a detailed answer...',
}: FAQTabProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: name as never,
  });

  const addFaq = () => {
    append({ question: '', answer: '' } as never);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={addFaq}>
          <Plus className="h-4 w-4 mr-1" />
          {addButtonText}
        </Button>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-8 border border-dashed rounded-lg">
          <p className="text-sm text-muted-foreground">{emptyMessage}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="p-4 border rounded-lg space-y-3 relative">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">FAQ {index + 1}</Label>
                {fields.length > 0 && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>

              <TextInput
                id={`${name}.${index}.question`}
                label="Question"
                required
                placeholder={questionPlaceholder}
                error={(form.formState.errors as any)[name]?.[index]?.question?.message as string}
                {...form.register(`${name}.${index}.question` as never)}
              />

              <TextArea
                id={`${name}.${index}.answer`}
                label="Answer"
                required
                placeholder={answerPlaceholder}
                error={(form.formState.errors as any)[name]?.[index]?.answer?.message as string}
                rows={3}
                className="resize-none"
                {...form.register(`${name}.${index}.answer` as never)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
