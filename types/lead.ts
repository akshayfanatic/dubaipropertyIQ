import type { Tables, TablesInsert, TablesUpdate } from './db/supabase-generated';
import type { PaginationFilters, SearchFilters } from './shared';

export type Lead = Tables<'leads'>;
export type LeadInsert = TablesInsert<'leads'>;
export type LeadUpdate = TablesUpdate<'leads'>;

export const LEAD_SOURCE_TYPES = ['newsletter', 'property', 'developer', 'area', 'calculator', 'golden_visa', 'callback', 'whatsapp', 'blog', 'pdf_download'] as const;

export const LEAD_STATUSES = ['new', 'contacted', 'qualified', 'converted', 'dead'] as const;

export type LeadSourceType = (typeof LEAD_SOURCE_TYPES)[number];
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export interface LeadFilters extends PaginationFilters, SearchFilters {
  sourceType?: LeadSourceType;
  status?: LeadStatus;
}
