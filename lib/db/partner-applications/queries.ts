'use server';

import { adminClient } from '@/lib/supabase/admin';
import { serverClient } from '@/lib/supabase/server';
import { ApiResponse, HttpStatus } from '@/lib/utils/response';
import type {
  AgentApplicationDetails,
  AgentPartnerApplicationFilters,
  DeveloperApplicationDetails,
  PartnerApplication,
  PartnerApplicationFilters,
  PartnerTargetRole,
  PartnerApplicationWithAgentDetails,
  PartnerApplicationWithDetails,
} from '@/types/partner-application';
import type { PaginatedResult } from '@/types/shared';

type PartnerApplicationRow = PartnerApplication & {
  agent_application_details?: AgentApplicationDetails | AgentApplicationDetails[] | null;
  developer_application_details?: DeveloperApplicationDetails | DeveloperApplicationDetails[] | null;
};

function getAgentDetails(row: PartnerApplicationRow): AgentApplicationDetails | null {
  if (Array.isArray(row.agent_application_details)) {
    return row.agent_application_details[0] ?? null;
  }

  return row.agent_application_details ?? null;
}

function getDeveloperDetails(row: PartnerApplicationRow): DeveloperApplicationDetails | null {
  if (Array.isArray(row.developer_application_details)) {
    return row.developer_application_details[0] ?? null;
  }

  return row.developer_application_details ?? null;
}

function toPartnerApplication(row: PartnerApplicationRow): PartnerApplicationWithDetails {
  const { agent_application_details: _agentDetails, developer_application_details: _developerDetails, ...application } = row;

  return {
    ...application,
    agent_details: getAgentDetails(row),
    developer_details: getDeveloperDetails(row),
  };
}

const partnerApplicationSelect = `
  *,
  agent_application_details (
    company_name,
    agency_name,
    rera_number,
    broker_id,
    experience_years,
    areas_of_focus,
    logo_url,
    message
  ),
  developer_application_details (
    company_name,
    trade_license_number,
    authorized_contact_name,
    contact_email,
    contact_phone,
    website_url,
    logo_url,
    active_project_details,
    bulk_upload_required,
    message
  )
`;

export async function getMyPartnerApplication(targetRole: PartnerTargetRole): Promise<ApiResponse<PartnerApplicationWithDetails | null>> {
  try {
    const supabase = await serverClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return ApiResponse({
        success: false,
        status: 401,
        message: 'Login required',
        error: { code: 'UNAUTHORIZED' },
      });
    }

    const { data, error } = await supabase
      .from('partner_applications')
      .select(partnerApplicationSelect)
      .eq('user_id', user.id)
      .eq('target_role', targetRole)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'QUERY_ERROR' },
      });
    }

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Partner application fetched successfully',
      data: data ? toPartnerApplication(data as PartnerApplicationRow) : null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch partner application';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

export async function getPartnerApplicationsAdmin(filters?: PartnerApplicationFilters): Promise<ApiResponse<PaginatedResult<PartnerApplicationWithDetails>>> {
  try {
    const supabase = adminClient();
    const page = filters?.page || 1;
    const pageSize = filters?.pageSize || 20;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase.from('partner_applications').select(partnerApplicationSelect, { count: 'exact' });

    if (filters?.target_role) {
      query = query.eq('target_role', filters.target_role);
    }

    if (filters?.search) {
      query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`);
    }

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error, count } = await query.order('created_at', { ascending: false }).range(from, to);

    if (error) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'QUERY_ERROR' },
      });
    }

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Partner applications fetched successfully',
      data: {
        data: ((data as PartnerApplicationRow[] | null) ?? []).map(toPartnerApplication),
        total: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch partner applications';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

export async function getPartnerApplicationByIdAdmin(id: string): Promise<ApiResponse<PartnerApplicationWithDetails | null>> {
  try {
    const supabase = adminClient();
    const { data, error } = await supabase.from('partner_applications').select(partnerApplicationSelect).eq('id', id).single();

    if (error) {
      if (error.code === 'PGRST116') {
        return ApiResponse({
          success: false,
          status: HttpStatus.NOT_FOUND,
          message: 'Partner application not found',
          error: { code: 'NOT_FOUND' },
        });
      }

      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'QUERY_ERROR' },
      });
    }

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Partner application fetched successfully',
      data: toPartnerApplication(data as PartnerApplicationRow),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch partner application';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

export async function getMyAgentApplication(): Promise<ApiResponse<PartnerApplicationWithAgentDetails | null>> {
  return getMyPartnerApplication('agent') as Promise<ApiResponse<PartnerApplicationWithAgentDetails | null>>;
}

export async function getMyLatestPartnerApplication(): Promise<ApiResponse<PartnerApplicationWithDetails | null>> {
  try {
    const supabase = await serverClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return ApiResponse({
        success: false,
        status: 401,
        message: 'Login required',
        error: { code: 'UNAUTHORIZED' },
      });
    }

    const { data, error } = await supabase.from('partner_applications').select(partnerApplicationSelect).eq('user_id', user.id).order('created_at', { ascending: false }).limit(1).maybeSingle();

    if (error) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'QUERY_ERROR' },
      });
    }

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Partner application fetched successfully',
      data: data ? toPartnerApplication(data as PartnerApplicationRow) : null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch partner application';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

export async function getAgentApplicationsAdmin(filters?: AgentPartnerApplicationFilters): Promise<ApiResponse<PaginatedResult<PartnerApplicationWithAgentDetails>>> {
  return getPartnerApplicationsAdmin({ ...filters, target_role: 'agent' }) as Promise<ApiResponse<PaginatedResult<PartnerApplicationWithAgentDetails>>>;
}

export async function getAgentApplicationByIdAdmin(id: string): Promise<ApiResponse<PartnerApplicationWithAgentDetails | null>> {
  return getPartnerApplicationByIdAdmin(id) as Promise<ApiResponse<PartnerApplicationWithAgentDetails | null>>;
}
