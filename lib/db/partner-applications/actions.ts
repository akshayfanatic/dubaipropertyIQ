'use server';

import { revalidatePath } from 'next/cache';
import { adminClient } from '@/lib/supabase/admin';
import { serverClient } from '@/lib/supabase/server';
import { ApiResponse, HttpStatus } from '@/lib/utils/response';
import { agentPartnerApplicationSchema, partnerApplicationReviewSchema, type AgentPartnerApplicationInput, type PartnerApplicationReviewInput } from '@/lib/validations/partner-application';
import type { AgentApplicationDetails, DeveloperApplicationDetails, PartnerApplication, PartnerApplicationWithAgentDetails } from '@/types/partner-application';

type PartnerApplicationRow = PartnerApplication & {
  target_role: 'agent';
  agent_application_details?: AgentApplicationDetails | AgentApplicationDetails[] | null;
};

type PartnerApplicationReviewRow = PartnerApplication & {
  agent_application_details?: AgentApplicationDetails | AgentApplicationDetails[] | null;
  developer_application_details?: DeveloperApplicationDetails | DeveloperApplicationDetails[] | null;
};

const partnerApplicationReviewSelect = `
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

function toAgentPartnerApplication(row: PartnerApplicationRow): PartnerApplicationWithAgentDetails {
  const { agent_application_details: details, ...application } = row;

  return {
    ...application,
    target_role: 'agent',
    agent_details: firstRelated(details),
    developer_details: null,
  };
}

function firstRelated<T>(value: T | T[] | null | undefined): T | null {
  return Array.isArray(value) ? (value[0] ?? null) : (value ?? null);
}

async function provisionApprovedPartnerAccount(application: PartnerApplicationReviewRow) {
  const supabase = adminClient();

  if (application.target_role === 'agent') {
    const details = firstRelated(application.agent_application_details);

    if (!details?.rera_number) {
      return { message: 'Agent application details are missing a RERA number', code: 'MISSING_AGENT_DETAILS' };
    }

    const { error: profileError } = await supabase.from('agent_profiles').upsert(
      {
        user_id: application.user_id,
        application_id: application.id,
        company_name: details.company_name,
        agency_name: details.agency_name,
        rera_number: details.rera_number,
        broker_id: details.broker_id,
        contact_name: application.full_name,
        email: application.email,
        phone: application.phone,
        whatsapp: application.whatsapp,
        logo_url: details.logo_url,
        status: 'active',
      },
      { onConflict: 'user_id' },
    );

    if (profileError) {
      return profileError;
    }
  }

  if (application.target_role === 'developer') {
    const details = firstRelated(application.developer_application_details);

    if (!details?.company_name) {
      return { message: 'Developer application details are missing a company name', code: 'MISSING_DEVELOPER_DETAILS' };
    }

    const { error: accountError } = await supabase.from('developer_accounts').upsert(
      {
        user_id: application.user_id,
        application_id: application.id,
        company_name: details.company_name,
        trade_license_number: details.trade_license_number,
        authorized_contact_name: details.authorized_contact_name,
        email: details.contact_email || application.email,
        phone: details.contact_phone || application.phone,
        website_url: details.website_url,
        logo_url: details.logo_url,
        status: 'active',
      },
      { onConflict: 'user_id' },
    );

    if (accountError) {
      return accountError;
    }
  }

  const { error: roleError } = await supabase.from('user_roles').upsert(
    {
      user_id: application.user_id,
      role: application.target_role,
    },
    { onConflict: 'user_id' },
  );

  return roleError;
}

export async function createAgentApplication(input: AgentPartnerApplicationInput) {
  try {
    const parsed = agentPartnerApplicationSchema.safeParse(input);

    if (!parsed.success) {
      return ApiResponse({
        success: false,
        status: HttpStatus.BAD_REQUEST,
        message: parsed.error.issues[0]?.message || 'Invalid application data',
        error: { code: 'VALIDATION_ERROR' },
      });
    }

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

    const { data: existing } = await supabase.from('partner_applications').select('id').eq('user_id', user.id).eq('target_role', 'agent').in('status', ['pending', 'reviewing']).maybeSingle();

    if (existing) {
      return ApiResponse({
        success: false,
        status: 409,
        message: 'You already have an application under review',
        error: { code: 'APPLICATION_EXISTS' },
      });
    }

    const { data: application, error: applicationError } = await supabase
      .from('partner_applications')
      .insert({
        target_role: 'agent',
        user_id: user.id,
        full_name: parsed.data.full_name,
        email: parsed.data.email || user.email || '',
        phone: parsed.data.phone,
        whatsapp: parsed.data.whatsapp,
      })
      .select()
      .single();

    if (applicationError) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: applicationError.message,
        error: { code: applicationError.code || 'CREATE_ERROR' },
      });
    }

    const { data: details, error: detailsError } = await supabase
      .from('agent_application_details')
      .insert({
        application_id: application.id,
        agency_name: parsed.data.agency_name,
        rera_number: parsed.data.rera_number,
        experience_years: parsed.data.experience_years,
        areas_of_focus: parsed.data.areas_of_focus,
        message: parsed.data.message,
      })
      .select()
      .single();

    if (detailsError) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: detailsError.message,
        error: { code: detailsError.code || 'CREATE_DETAILS_ERROR' },
      });
    }

    revalidatePath('/become-partner/agent');
    revalidatePath('/dashboard/admin/applications');

    return ApiResponse({
      success: true,
      status: HttpStatus.CREATED,
      message: 'Agent application submitted successfully',
      data: toAgentPartnerApplication({ ...(application as PartnerApplicationRow), agent_application_details: [details] }),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to submit application';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

export async function updatePartnerApplicationReviewAdmin(id: string, input: PartnerApplicationReviewInput) {
  try {
    const parsed = partnerApplicationReviewSchema.safeParse(input);

    if (!parsed.success) {
      return ApiResponse({
        success: false,
        status: HttpStatus.BAD_REQUEST,
        message: parsed.error.issues[0]?.message || 'Invalid review data',
        error: { code: 'VALIDATION_ERROR' },
      });
    }

    const supabase = adminClient();
    const sessionClient = await serverClient();
    const {
      data: { user },
    } = await sessionClient.auth.getUser();

    const { data: application, error: applicationError } = await supabase.from('partner_applications').select(partnerApplicationReviewSelect).eq('id', id).single();

    if (applicationError) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: applicationError.message,
        error: { code: applicationError.code || 'QUERY_ERROR' },
      });
    }

    if (parsed.data.status === 'approved') {
      const provisionError = await provisionApprovedPartnerAccount(application as PartnerApplicationReviewRow);

      if (provisionError) {
        return ApiResponse({
          success: false,
          status: HttpStatus.INTERNAL_ERROR,
          message: provisionError.message,
          error: { code: provisionError.code || 'PROVISION_ERROR' },
        });
      }
    }

    const { data, error } = await supabase
      .from('partner_applications')
      .update({
        status: parsed.data.status,
        admin_notes: parsed.data.admin_notes,
        reviewed_by: user?.id ?? null,
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'UPDATE_ERROR' },
      });
    }

    revalidatePath('/dashboard/admin/applications');
    revalidatePath(`/dashboard/admin/applications/${id}`);

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Application review updated',
      data: data as PartnerApplication,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update application';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

export async function updateAgentApplicationReviewAdmin(id: string, input: PartnerApplicationReviewInput) {
  return updatePartnerApplicationReviewAdmin(id, input);
}
