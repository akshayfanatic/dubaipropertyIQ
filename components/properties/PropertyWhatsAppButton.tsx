'use client';

import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/hooks/data/public/useSettings';
import type { PropertyListItem } from '@/types/property';
import { cn } from '@/lib/utils';

interface PropertyWhatsAppButtonProps {
  property: Pick<PropertyListItem, 'title' | 'slug'>;
  className?: string;
  variant?: 'card' | 'detail' | 'primary';
}

const buttonStyles = {
  card: 'h-11 w-full rounded-lg bg-card hover:bg-card/90 text-primary gap-2.5 border-2 border-primary/20 font-semibold text-sm shadow-lg hover:shadow-xl',
  detail: 'h-12 rounded-lg bg-card hover:bg-card/90 text-primary gap-2.5 border-2 border-primary/20 font-semibold shadow-lg',
  primary: 'h-12 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground gap-2.5 font-semibold shadow-lg hover:shadow-xl border-0',
};

export function PropertyWhatsAppButton({ property, className, variant = 'card' }: PropertyWhatsAppButtonProps) {
  const { data: settings } = useSettings();
  const whatsappNumber = settings?.contact?.whatsapp as string | undefined;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const message = `Hello, I'm interested in getting more information about ${property.title} from DubaiPropertyIQ or any similar projects that might be available. Project link: ${window.location.origin}/properties/${property.slug}`;
    const cleanNumber = whatsappNumber?.replace(/\s/g, '').replace(/(?<=^\+)\+/g, '') || '';
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const isPrimary = variant === 'primary';

  return (
    <Button size="sm" onClick={handleClick} className={cn(buttonStyles[variant], className)}>
      <MessageCircle className={cn('h-5 w-5', isPrimary ? 'fill-primary-foreground' : 'fill-primary')} strokeWidth={0} />
      <span>WhatsApp</span>
    </Button>
  );
}
