'use server';

import { revalidatePath } from 'next/cache';
import { adminClient } from '@/lib/supabase/admin';
import { serverClient } from '@/lib/supabase/server';
import { ApiResponse, HttpStatus } from '@/lib/utils/response';
import { agentProfileSchema, type AgentProfileInput } from '@/lib/validations/agent-profile';
import type { Tables } from '@/types/db/supabase-generated';

type AgentProfile = Tables<'agent_profiles'>;

export async function updateMyAgentProfile(input: AgentProfileInput): Promise<ApiResponse<AgentProfile>> {
  try {
    const parsed = agentProfileSchema.safeParse(input);

    if (!parsed.success) {
      return ApiResponse({
        success: false,
        status: HttpStatus.BAD_REQUEST,
        message: parsed.error.issues[0]?.message || 'Invalid profile data',
        error: { code: 'VALIDATION_ERROR' },
      });
    }

    const sessionClient = await serverClient();
    const {
      data: { user },
    } = await sessionClient.auth.getUser();

    if (!user) {
      return ApiResponse({
        success: false,
        status: 401,
        message: 'Login required',
        error: { code: 'UNAUTHORIZED' },
      });
    }

    const supabase = adminClient();
    const { error: avatarError } = await sessionClient.auth.updateUser({
      data: {
        avatar_url: parsed.data.avatar_url,
      },
    });

    if (avatarError) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: avatarError.message,
        error: { code: avatarError.code || 'AVATAR_UPDATE_ERROR' },
      });
    }

    const { data, error } = await supabase
      .from('agent_profiles')
      .update({
        contact_name: parsed.data.contact_name,
        phone: parsed.data.phone,
        whatsapp: parsed.data.whatsapp,
        agency_name: parsed.data.agency_name,
        company_name: parsed.data.company_name,
        broker_id: parsed.data.broker_id,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)
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

    revalidatePath('/dashboard/agent');
    revalidatePath('/dashboard/agent/profile');

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Agent profile updated',
      data,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update agent profile';

    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}
