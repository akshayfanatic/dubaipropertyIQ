/**
 * Site Settings Types
 * Types for global site configuration
 */

/**
 * Setting groups for organization
 */
export type SettingGroup = 'general' | 'contact' | 'social';

/**
 * Setting input types for form rendering
 */
export type SettingType = 'text' | 'url' | 'email' | 'tel' | 'textarea';

/**
 * Individual setting from database
 */
export interface Setting {
  id: string;
  key: string;
  value: unknown; // JSONB value - could be string, number, object, etc.
  group: SettingGroup;
  label: string;
  type: SettingType;
  updated_at: string;
}

/**
 * Setting value with its metadata
 */
export interface SettingValue {
  key: string;
  value: unknown;
  label: string;
  type: SettingType;
}

/**
 * Grouped settings structure
 * Each group contains key-value pairs of setting values
 */
export interface GroupedSettings {
  general: Record<string, unknown>;
  contact: Record<string, unknown>;
  social: Record<string, unknown>;
}

/**
 * All settings as a flat record
 */
export type SettingsRecord = Record<string, unknown>;

/**
 * Settings form data by group
 */
export interface GeneralSettings {
  site_name: string;
  logo_url: string;
}

export interface ContactSettings {
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
}

export interface SocialSettings {
  facebook: string;
  instagram: string;
  linkedin: string;
  twitter: string;
}

/**
 * Settings filter options
 */
export interface SettingsFilters {
  group?: SettingGroup;
}
