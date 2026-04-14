import { NextResponse } from 'next/server';
import { getDeveloperOptionsAdmin } from '@/lib/db/developers/queries';

export async function GET() {
  try {
    const response = await getDeveloperOptionsAdmin();

    if (!response.success) {
      return NextResponse.json({ error: response.message }, { status: response.status });
    }

    return NextResponse.json(response.data);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
