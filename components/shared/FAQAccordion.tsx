import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FAQ } from '@/types/shared';
import { cn } from '@/lib/utils';

interface FAQAccordionProps {
  faqs: FAQ[];
  type?: 'single' | 'multiple';
  defaultValue?: string;
  className?: string;
}

export function FAQAccordion({ faqs, type = 'single', defaultValue, className }: FAQAccordionProps) {
  if (!faqs || faqs.length === 0) return null;

  const items = faqs.map((faq) => (
    <AccordionItem key={faq.id} value={faq.id} className="overflow-hidden rounded-2xl !border border-border bg-card shadow-sm">
      <AccordionTrigger className="px-5 py-4 text-left text-base font-extrabold leading-6 text-foreground hover:no-underline">{faq.question}</AccordionTrigger>
      <AccordionContent className="border-t border-border px-5 pb-5 pt-4 text-base font-medium leading-7 text-muted-foreground">{faq.answer}</AccordionContent>
    </AccordionItem>
  ));

  if (type === 'single') {
    return (
      <Accordion type="single" collapsible defaultValue={defaultValue} className={cn('grid w-full gap-3', className)}>
        {items}
      </Accordion>
    );
  }

  return (
    <Accordion type="multiple" defaultValue={defaultValue ? [defaultValue] : undefined} className={cn('grid w-full gap-3', className)}>
      {items}
    </Accordion>
  );
}
