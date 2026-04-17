/**
 * Site Settings Configuration
 * Central configuration for all settings keys and their metadata
 */

import type { SettingGroup, SettingType } from '@/types/settings';
import type { LucideIcon } from 'lucide-react';
import { Globe, Image, Mail, Phone, MessageCircle, MapPin, Share2, Facebook, Instagram, Linkedin, X } from 'lucide-react';

// Re-export SettingGroup for use in components
export type { SettingGroup };

/**
 * Setting definition with metadata
 */
export interface SettingDefinition {
  key: string;
  group: SettingGroup;
  label: string;
  type: SettingType;
  defaultValue: unknown;
  icon?: LucideIcon;
}

/**
 * All setting definitions
 * This serves as the source of truth for what settings exist
 */
export const SETTINGS_DEFINITIONS: readonly SettingDefinition[] = [
  // General Settings
  {
    key: 'site_name',
    group: 'general',
    label: 'Site Name',
    type: 'text',
    defaultValue: 'Dubai Property IQ',
    icon: Globe,
  },
  {
    key: 'logo_url',
    group: 'general',
    label: 'Logo URL',
    type: 'url',
    defaultValue: '/logo.png',
    icon: Image,
  },

  // Contact Settings
  {
    key: 'email',
    group: 'contact',
    label: 'Email Address',
    type: 'email',
    defaultValue: 'info@dubaipropertyiq.com',
    icon: Mail,
  },
  {
    key: 'phone',
    group: 'contact',
    label: 'Phone Number',
    type: 'tel',
    defaultValue: '+971 4 123 4567',
    icon: Phone,
  },
  {
    key: 'whatsapp',
    group: 'contact',
    label: 'WhatsApp Number',
    type: 'tel',
    defaultValue: '+971 50 123 4567',
    icon: MessageCircle,
  },
  {
    key: 'address',
    group: 'contact',
    label: 'Address',
    type: 'textarea',
    defaultValue: 'Dubai Marina, Dubai, UAE',
    icon: MapPin,
  },

  // Social Settings
  {
    key: 'facebook',
    group: 'social',
    label: 'Facebook URL',
    type: 'url',
    defaultValue: 'https://facebook.com',
    icon: Facebook,
  },
  {
    key: 'instagram',
    group: 'social',
    label: 'Instagram URL',
    type: 'url',
    defaultValue: 'https://instagram.com',
    icon: Instagram,
  },
  {
    key: 'linkedin',
    group: 'social',
    label: 'LinkedIn URL',
    type: 'url',
    defaultValue: 'https://linkedin.com',
    icon: Linkedin,
  },
  {
    key: 'twitter',
    group: 'social',
    label: 'Twitter/X URL',
    type: 'url',
    defaultValue: 'https://twitter.com',
    icon: X,
  },
] as const;

/**
 * Get setting definition by key
 */
export function getSettingDefinition(key: string): SettingDefinition | undefined {
  return SETTINGS_DEFINITIONS.find((def) => def.key === key);
}

/**
 * Get settings by group
 */
export function getSettingsByGroup(group: SettingGroup): SettingDefinition[] {
  return SETTINGS_DEFINITIONS.filter((def) => def.group === group);
}

/**
 * Get all setting keys
 */
export const SETTING_KEYS = SETTINGS_DEFINITIONS.map((def) => def.key) as readonly string[];

/**
 * Setting groups order for UI
 */
export const SETTING_GROUPS: readonly SettingGroup[] = ['general', 'contact', 'social'] as const;

/**
 * Group display names
 */
export const SETTING_GROUP_LABELS: Record<SettingGroup, string> = {
  general: 'General',
  contact: 'Contact',
  social: 'Social',
} as const;

/**
 * Tab icons for each group
 */
export const TAB_ICONS: Record<SettingGroup, LucideIcon> = {
  general: Globe,
  contact: Phone,
  social: Share2,
} as const;
