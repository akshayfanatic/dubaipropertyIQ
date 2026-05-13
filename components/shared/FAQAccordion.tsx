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
    <AccordionItem key={faq.id} value={faq.id}>
      <AccordionTrigger className="text-left text-md font-bold hover:no-underline py-4">{faq.question}</AccordionTrigger>
      <AccordionContent className="text-base text-muted-foreground leading-relaxed pb-4">{faq.answer}</AccordionContent>
    </AccordionItem>
  ));

  if (type === 'single') {
    return (
      <Accordion type="single" collapsible defaultValue={defaultValue} className={cn('w-full', className)}>
        {items}
      </Accordion>
    );
  }

  return (
    <Accordion type="multiple" defaultValue={defaultValue ? [defaultValue] : undefined} className={cn('w-full', className)}>
      {items}
    </Accordion>
  );
}
