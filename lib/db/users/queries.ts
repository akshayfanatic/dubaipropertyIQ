'use server';

import { adminClient } from '@/lib/supabase/admin';
import { ApiResponse, HttpStatus } from '@/lib/utils/response';
import type { UserRole, UserWithRole } from '@/types/user-admin';

/**
 * Get all users (frontend handles filtering/pagination)
 */
export async function getUsersAdmin(): Promise<ApiResponse<UserWithRole[]>> {
  try {
    const supabase = adminClient();

    const {
      data: { users },
      error,
    } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
    if (error) {
      return ApiResponse({ success: false, status: HttpStatus.INTERNAL_ERROR, message: error.message, error: { code: 'FETCH_ERROR' } });
    }

    const { data: userRoles } = await supabase.from('user_roles').select('user_id, role');
    const roleMap = new Map(userRoles?.map((r) => [r.user_id, r.role as UserRole]) ?? []);

    // Add role to each user, keep original structure
    const data = users.map((user) => ({
      ...user,
      role: roleMap.get(user.id) ?? 'customer',
    }));

    return ApiResponse({ success: true, status: HttpStatus.OK, message: 'Users fetched successfully', data });
  } catch (error) {
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message: error instanceof Error ? error.message : 'Failed to fetch users',
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Get a single user by ID
 */
export async function getUserByIdAdmin(id: string): Promise<ApiResponse<UserWithRole>> {
  try {
    const supabase = adminClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.admin.getUserById(id);

    if (error || !user) {
      return ApiResponse({ success: false, status: HttpStatus.NOT_FOUND, message: 'User not found', error: { code: 'NOT_FOUND' } });
    }

    const { data: userRole } = await supabase.from('user_roles').select('role').eq('user_id', id).single();

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'User fetched successfully',
      data: {
        ...user,
        role: (userRole?.role as UserRole) ?? 'customer',
      },
    });
  } catch (error) {
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message: error instanceof Error ? error.message : 'Failed to fetch user',
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Get user count using RPC
 */
export async function getUserCountAdmin(): Promise<ApiResponse<number>> {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase.rpc('get_user_count');

    if (error) {
      return ApiResponse({ success: false, status: HttpStatus.INTERNAL_ERROR, message: error.message, error: { code: 'RPC_ERROR' } });
    }

    return ApiResponse({ success: true, status: HttpStatus.OK, message: 'User count fetched successfully', data: data as number });
  } catch (error) {
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message: error instanceof Error ? error.message : 'Failed to fetch user count',
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}
