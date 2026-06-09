/**
 * Page Actions
 * Write operations for pages (Create, Update, Delete)
 */

'use server';

import { adminClient } from '@/lib/supabase/admin';
import { ApiResponse, HttpStatus } from '@/lib/utils/response';
import { Page } from '@/types/page';
import { PageInsertData, PageUpdateData } from '@/lib/validations/page';
import { revalidatePath } from 'next/cache';

export type PageInsertAction = PageInsertData;
export type PageUpdateAction = PageUpdateData;

function splitPageSEO<T extends PageInsertAction | PageUpdateAction>(page: T) {
  const { meta_title, meta_description, ...pageData } = page;

  return {
    pageData,
    seoData: {
      meta_title: meta_title || null,
      meta_description: meta_description || null,
    },
  };
}

/**
 * Create a new page
 */
export async function createPage(page: PageInsertAction) {
  try {
    const supabase = adminClient();
    const { pageData, seoData } = splitPageSEO(page);

    const { data, error } = await supabase.from('pages').insert(pageData).select().single();

    if (error) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'CREATE_ERROR' },
      });
    }

    const { error: seoError } = await supabase.from('pages_seo').upsert(
      {
        page_id: data.id,
        ...seoData,
      },
      { onConflict: 'page_id' },
    );

    if (seoError) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: seoError.message,
        error: { code: seoError.code || 'SEO_UPSERT_ERROR' },
      });
    }

    // Revalidate cache
    revalidatePath('/dashboard/admin/pages');
    revalidatePath('/pages/[slug]');

    return ApiResponse({
      success: true,
      status: HttpStatus.CREATED,
      message: 'Page created successfully',
      data: data as Page,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create page';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Update an existing page
 */
export async function updatePage(id: string, updates: PageUpdateAction) {
  try {
    const supabase = adminClient();
    const { pageData, seoData } = splitPageSEO(updates);

    const { data, error } = await supabase.from('pages').update(pageData).eq('id', id).select().single();

    if (error) {
      if (error.code === 'PGRST116') {
        return ApiResponse({
          success: false,
          status: HttpStatus.NOT_FOUND,
          message: 'Page not found',
          error: { code: 'NOT_FOUND' },
        });
      }
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'UPDATE_ERROR' },
      });
    }

    const { error: seoError } = await supabase.from('pages_seo').upsert(
      {
        page_id: id,
        ...seoData,
      },
      { onConflict: 'page_id' },
    );

    if (seoError) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: seoError.message,
        error: { code: seoError.code || 'SEO_UPSERT_ERROR' },
      });
    }

    // Revalidate cache
    revalidatePath('/dashboard/admin/pages');
    revalidatePath('/pages/[slug]');

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Page updated successfully',
      data: data as Page,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update page';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Delete a page
 */
export async function deletePage(id: string) {
  try {
    const supabase = adminClient();

    const { error } = await supabase.from('pages').delete().eq('id', id);

    if (error) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'DELETE_ERROR' },
      });
    }

    // Revalidate cache
    revalidatePath('/dashboard/admin/pages');
    revalidatePath('/pages/[slug]');

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Page deleted successfully',
      data: null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete page';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}
