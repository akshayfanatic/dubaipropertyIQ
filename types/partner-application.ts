import type { PaginationFilters, SearchFilters } from './shared';
import type { Database, Tables } from './db/supabase-generated';

type AppRole = Database['public']['Enums']['app_role'];

export type PartnerApplicationStatus = Database['public']['Enums']['partner_application_status'];

export const PARTNER_TARGET_ROLES = ['agent', 'developer'] as const satisfies readonly AppRole[];
export const PARTNER_APPLICATION_STATUSES = ['pending', 'reviewing', 'approved', 'rejected'] as const satisfies readonly PartnerApplicationStatus[];

export type PartnerTargetRole = (typeof PARTNER_TARGET_ROLES)[number];

export type PartnerApplication = Omit<Tables<'partner_applications'>, 'target_role'> & {
  target_role: PartnerTargetRole;
};

type AgentApplicationDetailsRow = Tables<'agent_application_details'>;

export type AgentApplicationDetails = Pick<AgentApplicationDetailsRow, 'company_name' | 'agency_name' | 'rera_number' | 'broker_id' | 'experience_years' | 'areas_of_focus' | 'logo_url' | 'message'>;

type DeveloperApplicationDetailsRow = Tables<'developer_application_details'>;

export type DeveloperApplicationDetails = Pick<
  DeveloperApplicationDetailsRow,
  'company_name' | 'trade_license_number' | 'authorized_contact_name' | 'contact_email' | 'contact_phone' | 'website_url' | 'logo_url' | 'active_project_details' | 'bulk_upload_required' | 'message'
>;

export interface PartnerApplicationWithDetails extends PartnerApplication {
  agent_details: AgentApplicationDetails | null;
  developer_details: DeveloperApplicationDetails | null;
}

export interface PartnerApplicationWithAgentDetails extends PartnerApplicationWithDetails {
  target_role: 'agent';
}

export interface PartnerApplicationFilters extends SearchFilters, PaginationFilters {
  target_role?: PartnerTargetRole;
  status?: PartnerApplicationStatus;
}

export type AgentPartnerApplicationFilters = Omit<PartnerApplicationFilters, 'target_role'>;

export const PARTNER_APPLICATION_STATUS_LABELS: Record<PartnerApplicationStatus, string> = {
  pending: 'Pending',
  reviewing: 'Reviewing',
  approved: 'Approved',
  rejected: 'Rejected',
};

export const PARTNER_TARGET_ROLE_LABELS: Record<PartnerTargetRole, string> = {
  agent: 'Agent',
  developer: 'Developer',
};
