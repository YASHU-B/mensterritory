import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { verifySessionToken, ADMIN_COOKIE_NAME } from '@/lib/auth';

function isValidUUID(uuid?: string | null): boolean {
  if (!uuid) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid);
}

async function verifyAuth(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return await verifySessionToken(token);
}

export async function GET() {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Database service is temporarily unavailable' }, { status: 503 });
  }

  const { data, error } = await supabaseAdmin
    .from('banners')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch banners' }, { status: 500 });
  }

  return NextResponse.json(
    { banners: data },
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

  const targetId = isValidUUID(body.id) ? body.id : crypto.randomUUID();

  const payload = {
    id: targetId,
    title: body.title || "MEN'S TERRITORY",
    subtitle: body.subtitle || '',
    cta_text: body.cta_text || 'SHOP NOW',
    cta_link: body.cta_link || '/shop',
    image_url: body.image_url || '',
    display_order: Number(body.display_order ?? 0),
    is_active: body.is_active ?? true,
    banner_type: body.banner_type || body.type || 'hero',
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabaseAdmin
    .from('banners')
    .upsert(payload, { onConflict: 'id' })
    .select()
    .single();

  if (error) {
    console.error('Supabase admin banners upsert error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Purge storefront cache
  try {
    const { revalidatePath } = await import('next/cache');
    revalidatePath('/', 'layout');
    revalidatePath('/');
    revalidatePath('/shop');
  } catch (err) {
    console.warn('revalidatePath error:', err);
  }

  return NextResponse.json({ banner: data });
}

export async function DELETE(req: NextRequest) {
  const session = await verifyAuth(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized: Admin session required' }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Database service is temporarily unavailable' }, { status: 503 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Banner ID is required' }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from('banners').delete().eq('id', id);

  if (error) {
    return NextResponse.json({ error: 'Failed to delete banner' }, { status: 500 });
  }

  return NextResponse.json({ success: true, id });
}
