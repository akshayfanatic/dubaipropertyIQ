'use server';

import { adminClient } from '@/lib/supabase/admin';
import { ApiResponse, HttpStatus } from '@/lib/utils/response';
import type { UserRoleUpdate, UserRole } from '@/types/user-admin';
import { revalidatePath } from 'next/cache';

export interface UserCreateData {
  email: string;
  password: string;
  role: UserRole;
  email_confirm?: boolean;
}

/**
 * Create a new user (admin only)
 */
export async function createUserAdmin(data: UserCreateData) {
  try {
    const supabase = adminClient();

    // Create user via Supabase Auth Admin API
    const {
      data: { user },
      error,
    } = await supabase.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: data.email_confirm ?? true,
    });

    if (error || !user) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error?.message || 'Failed to create user',
        error: { code: error?.code || 'CREATE_ERROR' },
      });
    }

    // Set user role
    const { error: roleError } = await supabase.from('user_roles').insert({ user_id: user.id, role: data.role });

    if (roleError) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: roleError.message,
        error: { code: roleError.code || 'ROLE_ERROR' },
      });
    }

    // Revalidate cache
    revalidatePath('/dashboard/admin/users');

    return ApiResponse({
      success: true,
      status: HttpStatus.CREATED,
      message: 'User created successfully',
      data: { id: user.id },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create user';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Update user role (admin only)
 */
export async function updateUserRoleAdmin(id: string, updates: UserRoleUpdate) {
  try {
    const supabase = adminClient();

    // Check if user exists
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.admin.getUserById(id);

    if (userError || !user) {
      return ApiResponse({
        success: false,
        status: HttpStatus.NOT_FOUND,
        message: 'User not found',
        error: { code: 'NOT_FOUND' },
      });
    }

    // Prevent removing own admin role
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session?.user.id === id && updates.role !== 'admin') {
      return ApiResponse({
        success: false,
        status: HttpStatus.FORBIDDEN,
        message: 'Cannot remove your own admin role',
        error: { code: 'CANNOT_REMOVE_OWN_ROLE' },
      });
    }

    // Update role in user_roles table (upsert for safety)
    const { error: roleError } = await supabase.from('user_roles').upsert({ user_id: id, role: updates.role as UserRole }, { onConflict: 'user_id' });

    if (roleError) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: roleError.message,
        error: { code: roleError.code || 'UPDATE_ERROR' },
      });
    }

    // Revalidate cache
    revalidatePath('/dashboard/admin/users');

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'User role updated successfully',
      data: null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update user role';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Delete a user (soft delete via Supabase Auth) - admin only
 */
export async function deleteUserAdmin(id: string) {
  try {
    const supabase = adminClient();

    // Prevent deleting yourself
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session?.user.id === id) {
      return ApiResponse({
        success: false,
        status: HttpStatus.FORBIDDEN,
        message: 'Cannot delete your own account',
        error: { code: 'CANNOT_DELETE_SELF' },
      });
    }

    // Check if this is the last admin
    const { data: adminRoles } = await supabase.from('user_roles').select('user_id').eq('role', 'admin');

    const isAdmin = adminRoles?.some((ur) => ur.user_id === id);
    if (isAdmin && adminRoles && adminRoles.length <= 1) {
      return ApiResponse({
        success: false,
        status: HttpStatus.FORBIDDEN,
        message: 'Cannot delete the last admin user',
        error: { code: 'LAST_ADMIN' },
      });
    }

    // Delete user via Supabase Auth Admin API
    const { error } = await supabase.auth.admin.deleteUser(id);

    if (error) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'DELETE_ERROR' },
      });
    }

    // Revalidate cache
    revalidatePath('/dashboard/admin/users');

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'User deleted successfully',
      data: null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete user';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}
