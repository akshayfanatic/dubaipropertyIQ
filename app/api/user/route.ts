import { NextResponse } from 'next/server';
import { serverClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await serverClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      displayName: user.user_metadata?.display_name || null,
      createdAt: user.created_at,
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
