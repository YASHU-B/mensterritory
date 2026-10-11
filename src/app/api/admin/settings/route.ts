import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { verifySessionToken, ADMIN_COOKIE_NAME } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

async function verifyAuth(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return await verifySessionToken(token);
}

export async function GET() {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Database service is temporarily unavailable' }, { status: 503 });
  }

  const { data, error } = await supabaseAdmin
    .from('store_settings')
    .select('*')
    .limit(1)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    { settings: data },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    }
  );
}

export async function POST(req: NextRequest) {
  const session = await verifyAuth(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized: Admin session required' }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Database service is temporarily unavailable' }, { status: 503 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  const targetId = body.id || 'a0000000-0000-0000-0000-000000000001';

  const payload = {
    ...body,
    id: targetId,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabaseAdmin
    .from('store_settings')
    .upsert(payload, { onConflict: 'id' })
    .select()
    .single();

  if (error) {
    console.error('Supabase admin store_settings upsert error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Purge Next.js cache so updates reflect immediately
  try {
    revalidatePath('/', 'layout');
    revalidatePath('/');
    revalidatePath('/shop');
  } catch (err) {
    console.warn('revalidatePath error:', err);
  }

  return NextResponse.json({ settings: data });
}
