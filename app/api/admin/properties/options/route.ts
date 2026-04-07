import { NextResponse } from 'next/server';
import { getPropertyOptionsAdmin } from '@/lib/db/properties/queries';

export async function GET() {
  const result = await getPropertyOptionsAdmin();

  if (!result.success || !result.data) {
    return NextResponse.json({ success: false, message: result.message }, { status: result.status });
  }

  return NextResponse.json({ success: true, data: result.data });
}
