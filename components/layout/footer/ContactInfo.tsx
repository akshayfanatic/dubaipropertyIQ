'use client';

import { Mail, Phone, MessageCircle, MapPin } from 'lucide-react';
import { useSettings } from '@/hooks/data/public/useSettings';

const contactConfig = [
  { key: 'email' as const, icon: Mail, label: 'Email', type: 'mailto' },
  { key: 'phone' as const, icon: Phone, label: 'Phone', type: 'tel' },
  { key: 'whatsapp' as const, icon: MessageCircle, label: 'WhatsApp', type: 'whatsapp' },
  { key: 'address' as const, icon: MapPin, label: 'Address', type: 'text' },
];

type ContactInfoProps = {
  title?: string;
  children?: React.ReactNode;
};

export function ContactInfo({ title = '', children }: ContactInfoProps) {
  const { data } = useSettings();
  const contact = data?.contact || {};

  const getHref = (type: string, value: string) => {
    switch (type) {
      case 'mailto':
        return `mailto:${value}`;
      case 'tel':
        return `tel:${value}`;
      case 'whatsapp':
        return `https://wa.me/${value}`;
      default:
        return undefined;
    }
  };

  return (
    <div className="space-y-4">
      {title ? <h3 className="text-sm font-semibold mb-3">{title}</h3> : null}
      <ul className="space-y-2">
        {contactConfig.map(({ key, icon: Icon, type }) => {
          const value = contact[key] as string | undefined;
          if (!value) return null;

          const href = getHref(type, value);

          return (
            <li key={key} className="flex items-start gap-2">
              <Icon className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
              {href ? (
                <a href={href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  {value}
                </a>
              ) : (
                <span className="text-sm text-muted-foreground">{value}</span>
              )}
            </li>
          );
        })}
      </ul>
      {children}
    </div>
  );
}
