/**
 * Settings Helper
 * Convenience functions for accessing settings in components
 */

import { getGroupedSettings, getSetting } from '@/lib/db/settings/queries';

/**
 * Get all settings for use in server components
 * This is the recommended way to access settings in the frontend
 */
export async function getSettings() {
  const result = await getGroupedSettings();
  return result.success ? (result.data ?? { general: {}, contact: {}, social: {} }) : { general: {}, contact: {}, social: {} };
}

/**
 * Get a single setting value
 */
export async function getSiteSetting(key: string) {
  const result = await getSetting(key);
  return result.success ? result.data : null;
}

/**
 * Type-safe accessors for settings groups
 */
export async function getGeneralSettings() {
  const settings = await getSettings();
  return settings.general;
}

export async function getContactSettings() {
  const settings = await getSettings();
  return settings.contact;
}

export async function getSocialSettings() {
  const settings = await getSettings();
  return settings.social;
}
