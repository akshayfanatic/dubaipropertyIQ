'use server';

import { adminClient } from '@/lib/supabase/admin';
import { sendLeadNotificationEmail } from '@/lib/email/send-lead-notification';
import { ApiResponse, HttpStatus } from '@/lib/utils/response';
import { leadSchema, leadStatusSchema, type LeadInput } from '@/lib/validations/lead';
import type { Lead, LeadStatus } from '@/types/lead';

export async function createLead(input: LeadInput) {
  try {
    const parsed = leadSchema.safeParse(input);

    if (!parsed.success) {
      return ApiResponse({
        success: false,
        status: HttpStatus.BAD_REQUEST,
        message: parsed.error.issues[0]?.message || 'Invalid lead data',
        error: { code: 'VALIDATION_ERROR' },
      });
    }

    const supabase = adminClient();
    const { data, error } = await supabase.from('leads').insert(parsed.data).select().single();

    if (error) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'CREATE_ERROR' },
      });
    }

    const lead = data as Lead;

    try {
      await sendLeadNotificationEmail(lead);
    } catch (emailError) {
      console.error('Lead email notification failed:', emailError);
    }

    return ApiResponse({
      success: true,
      status: HttpStatus.CREATED,
      message: 'Lead captured successfully',
      data: lead,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to capture lead';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

export async function updateLeadStatusAdmin(id: string, status: LeadStatus) {
  try {
    if (!id) {
      return ApiResponse({
        success: false,
        status: HttpStatus.BAD_REQUEST,
        message: 'Lead id is required',
        error: { code: 'VALIDATION_ERROR' },
      });
    }

    const parsedStatus = leadStatusSchema.safeParse(status);

    if (!parsedStatus.success) {
      return ApiResponse({
        success: false,
        status: HttpStatus.BAD_REQUEST,
        message: 'Invalid lead status',
        error: { code: 'VALIDATION_ERROR' },
      });
    }

    const supabase = adminClient();
    const { data, error } = await supabase.from('leads').update({ status: parsedStatus.data }).eq('id', id).select().single();

    if (error) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'UPDATE_ERROR' },
      });
    }

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Lead status updated successfully',
      data: data as Lead,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update lead status';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}
