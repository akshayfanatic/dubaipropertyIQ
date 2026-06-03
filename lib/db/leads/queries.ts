'use server';

import { adminClient } from '@/lib/supabase/admin';
import { ApiResponse, HttpStatus } from '@/lib/utils/response';
import type { Lead, LeadFilters } from '@/types/lead';
import type { PaginatedResult } from '@/types/shared';

export async function getLeadsAdmin(filters?: LeadFilters): Promise<ApiResponse<PaginatedResult<Lead>>> {
  try {
    const supabase = adminClient();
    const page = filters?.page || 1;
    const pageSize = filters?.pageSize || 20;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase.from('leads').select('*', { count: 'exact' });

    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,phone.ilike.%${filters.search}%,area_of_interest.ilike.%${filters.search}%`);
    }

    if (filters?.sourceType) {
      query = query.eq('source_type', filters.sourceType);
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
      message: 'Leads fetched successfully',
      data: {
        data: (data as Lead[]) ?? [],
        total: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch leads';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

export async function getLeadByIdAdmin(id: string): Promise<ApiResponse<Lead | null>> {
  try {
    const supabase = adminClient();
    const { data, error } = await supabase.from('leads').select('*').eq('id', id).single();

    if (error) {
      if (error.code === 'PGRST116') {
        return ApiResponse({
          success: false,
          status: HttpStatus.NOT_FOUND,
          message: 'Lead not found',
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
      message: 'Lead fetched successfully',
      data: data as Lead,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch lead';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}
