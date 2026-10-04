import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { verifySessionToken, ADMIN_COOKIE_NAME } from '@/lib/auth';

async function verifyAuth(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return await verifySessionToken(token);
}

export async function GET() {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase is not configured on server' }, { status: 503 });
  }

  const { data, error } = await supabaseAdmin
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ orders: data });
}

export async function PUT(req: NextRequest) {
  const session = await verifyAuth(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized: Admin session required' }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase is not configured on server' }, { status: 503 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  const { id, order_status, tracking_link, courier_name, tracking_number } = body;
  if (!id) {
    return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
  }

  const updateData: any = { updated_at: new Date().toISOString() };
  if (order_status) updateData.order_status = order_status;
  if (tracking_link !== undefined) updateData.tracking_link = tracking_link;
  if (courier_name !== undefined) updateData.courier_name = courier_name;
  if (tracking_number !== undefined) updateData.tracking_number = tracking_number;

  const { data, error } = await supabaseAdmin
    .from('orders')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ order: data });
}
