import { NextResponse } from 'next/server';
import { getAreaOptionsAdmin } from '@/lib/db/areas/queries';

export async function GET() {
  const result = await getAreaOptionsAdmin();

  if (!result.success || !result.data) {
    return NextResponse.json({ success: false, message: result.message }, { status: result.status });
  }

  return NextResponse.json({ success: true, data: result.data });
}
