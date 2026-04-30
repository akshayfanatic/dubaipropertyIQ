import { FooterCopyrightProps } from '@/types/footer';

export function FooterCopyright({ text, company = 'Dubai Property IQ', year }: FooterCopyrightProps) {
  const currentYear = year ?? new Date().getFullYear();
  const copyrightText = text ?? `© ${currentYear} ${company}. All rights reserved.`;

  return (
    <div className="border-t border-border">
      <div className="container mx-auto px-4 py-4 lg:px-8">
        <p className="text-sm text-center text-muted-foreground">{copyrightText}</p>
      </div>
    </div>
  );
}
