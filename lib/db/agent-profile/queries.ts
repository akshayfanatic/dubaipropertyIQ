'use server';

import { serverClient } from '@/lib/supabase/server';
import { adminClient } from '@/lib/supabase/admin';
import { ApiResponse, HttpStatus } from '@/lib/utils/response';
import type { Tables } from '@/types/db/supabase-generated';

export type AgentProfile = Tables<'agent_profiles'>;

export async function getMyAgentProfile(): Promise<ApiResponse<AgentProfile | null>> {
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

    const admin = adminClient();
    const { data, error } = await admin.from('agent_profiles').select('*').eq('user_id', user.id).maybeSingle();

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
      message: 'Agent profile fetched successfully',
      data,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch agent profile';

    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}
