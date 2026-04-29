import { ReactNode } from 'react';

export interface LinkItem {
  href: string;
  label: string;
}

export interface SocialLink {
  platform: string;
  href: string;
  icon: ReactNode;
}

export interface QuickLinksProps {
  title: string;
  links?: LinkItem[];
}

export interface SocialLinksProps {
  title: string;
  links?: SocialLink[];
}

export interface FooterBrandProps {
  name?: string;
  tagline?: string;
  href?: string;
}

export interface FooterCopyrightProps {
  text?: string;
  company?: string;
  year?: number;
}

export interface FooterProps {
  brand?: FooterBrandProps;
  quickLinks?: LinkItem[];
  socialLinks?: SocialLink[];
  copyright?: FooterCopyrightProps;
}
