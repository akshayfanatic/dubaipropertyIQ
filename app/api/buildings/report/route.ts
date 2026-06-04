import { NextResponse } from 'next/server';
import { z } from 'zod';
import { adminClient } from '@/lib/supabase/admin';
import { normalizeBuildingWithRelations } from '@/lib/utils/buildings';
import { createBuildingReportPdf } from '@/lib/reports/building-report-pdf';
import { withBuildingAmenityLabels } from '@/lib/utils/building-report';
import { pdfDownloadFileName } from '@/lib/utils/download';

const reportRequestSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().email('Enter a valid email address'),
  citySlug: z.string().trim().min(1, 'City is required'),
  areaSlug: z.string().trim().min(1, 'Area is required'),
  buildingSlug: z.string().trim().min(1, 'Building is required'),
  sourcePage: z.string().trim().min(1, 'Source page is required'),
  utmSource: z.string().nullable().optional(),
  utmMedium: z.string().nullable().optional(),
  utmCampaign: z.string().nullable().optional(),
});

export async function POST(request: Request) {
  const payload = reportRequestSchema.safeParse(await request.json().catch(() => null));

  if (!payload.success) {
    return NextResponse.json({ success: false, message: payload.error.issues[0]?.message || 'Invalid report request' }, { status: 400 });
  }

  const supabase = adminClient();
  const { data: buildingData, error: buildingError } = await supabase
    .from('buildings')
    .select('*, area:areas!inner(id, name, slug), city:cities!inner(id, name, slug, logo_url), developer:developers(id, name, slug, logo_url)')
    .eq('slug', payload.data.buildingSlug)
    .eq('areas.slug', payload.data.areaSlug)
    .eq('cities.slug', payload.data.citySlug)
    .single();

  if (buildingError || !buildingData) {
    return NextResponse.json({ success: false, message: buildingError?.message || 'Building not found' }, { status: buildingError?.code === 'PGRST116' ? 404 : 500 });
  }

  const building = await withBuildingAmenityLabels(normalizeBuildingWithRelations(buildingData as Record<string, unknown>), supabase);
  const lead = {
    name: payload.data.name,
    email: payload.data.email,
    source_type: 'pdf_download',
    source_page: payload.data.sourcePage,
    area_of_interest: building.name,
    message: `Downloaded building report for ${building.name}.`,
    utm_source: payload.data.utmSource ?? null,
    utm_medium: payload.data.utmMedium ?? null,
    utm_campaign: payload.data.utmCampaign ?? null,
  } as const;

  const { error: leadError } = await supabase.from('leads').insert(lead);

  if (leadError) {
    return NextResponse.json({ success: false, message: leadError.message }, { status: 500 });
  }

  const pdfBody = await createBuildingReportPdf(building);

  return new Response(pdfBody, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${pdfDownloadFileName(building.name)}"`,
      'Cache-Control': 'no-store',
    },
  });
}
