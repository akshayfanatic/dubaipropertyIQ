// lib/db/dashboard/queries.ts
'use server';

/**
 * Dashboard Queries
 * Aggregated statistics and overview data for admin dashboard
 */

import { adminClient } from '@/lib/supabase/admin';
import { ApiResponse, HttpStatus } from '@/lib/utils/response';
import { getUserCountAdmin } from '@/lib/db/users/queries';
import type { DashboardStats } from '@/types/dashboard';

// Recent property type for dashboard display
export interface RecentProperty {
  id: string;
  title: string;
  slug: string;
}

/**
 * Get dashboard statistics
 * Returns counts for properties, areas, developers, and users
 */
export async function getDashboardStatsAdmin(): Promise<ApiResponse<DashboardStats>> {
  try {
    const supabase = adminClient();

    // Get counts in parallel
    const [{ count: propertiesCount }, { count: areasCount }, { count: developersCount }, usersResult] = await Promise.all([
      supabase.from('properties').select('*', { count: 'exact', head: true }),
      supabase.from('areas').select('*', { count: 'exact', head: true }),
      supabase.from('developers').select('*', { count: 'exact', head: true }),
      getUserCountAdmin(),
    ]);

    const usersCount = usersResult.success ? (usersResult.data as number) : 0;

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Dashboard stats fetched successfully',
      data: {
        properties: propertiesCount || 0,
        areas: areasCount || 0,
        developers: developersCount || 0,
        users: usersCount,
      },
    });
  } catch (error) {
    console.error('[getDashboardStatsAdmin] Error:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch dashboard stats';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Get recent properties for dashboard (simplified - just id, title, slug)
 * Returns the 10 most recently created properties
 */
export async function getRecentPropertiesAdmin(): Promise<ApiResponse<RecentProperty[]>> {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase.from('properties').select('id, slug, title').order('created_at', { ascending: false }).limit(10);

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
      message: 'Recent properties fetched successfully',
      data: (data || []) as RecentProperty[],
    });
  } catch (error) {
    console.error('[getRecentProperties] Error:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch recent properties';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}
