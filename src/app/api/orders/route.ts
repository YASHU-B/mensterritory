import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

function isValidUUID(str?: string | null): boolean {
  if (!str) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
}

function mapSupabaseOrder(row: any) {
  const items = Array.isArray(row.order_items)
    ? row.order_items.map((it: any) => ({
        id: it.id,
        order_id: it.order_id,
        product_id: it.product_id,
        product_name: it.product_name,
        sku: it.sku || '',
        quantity: Number(it.quantity) || 1,
        size: it.size || 'Free Size',
        color: it.color || 'Default',
        unit_price: Number(it.unit_price) || 0,
        total_price: Number(it.total_price) || 0,
        image_url: it.product_image || it.image_url || '',
      }))
    : [];

  return {
    id: row.id,
    order_number: row.order_number,
    customer_name: row.customer_name,
    phone: row.customer_phone || row.phone || '',
    alternative_phone: row.alternative_phone || '',
    email: row.customer_email || row.email || '',
    address: row.shipping_address || row.address || '',
    city: row.city || 'Nagari',
    district: row.district || '',
    state: row.state || 'Andhra Pradesh',
    pincode: row.pincode || '',
    notes: row.notes || '',
    subtotal: Number(row.total_amount || 0),
    discount: Number(row.discount_amount || 0),
    total: Number(row.total_amount || 0),
    status: (row.order_status || 'Pending'),
    payment_status: (row.payment_status || 'pending'),
    order_source: (row.payment_method === 'whatsapp_pay' ? 'WhatsApp' : 'Store'),
    internal_notes: row.notes || '',
    tracking_number: row.tracking_number || '',
    courier_name: row.courier_name || '',
    tracking_link: row.tracking_link || '',
    created_at: row.created_at,
    updated_at: row.updated_at,
    items,
  };
}

/**
 * GET /api/orders - Fetch orders list (used by admin and storefront)
 */
export async function GET(req: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Database unconfigured' }, { status: 503 });
  }

  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');

  let dbQuery = supabaseAdmin
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .order('created_at', { ascending: false });

  if (query) {
    const clean = query.trim();
    dbQuery = dbQuery.or(
      `order_number.ilike.%${clean}%,customer_name.ilike.%${clean}%,customer_phone.ilike.%${clean}%`
    );
  }

  const { data, error } = await dbQuery;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const mapped = (data || []).map(mapSupabaseOrder);
  return NextResponse.json({ orders: mapped });
}

/**
 * POST /api/orders - Create a new customer order
 */
export async function POST(req: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Database unconfigured' }, { status: 503 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  const { orderInput, items } = body;
  if (!orderInput || !items) {
    return NextResponse.json({ error: 'orderInput and items are required' }, { status: 400 });
  }

  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderNumber = orderInput.order_number || `MT-${dateStr}-${randomSuffix}`;

  const payload = {
    order_number: orderNumber,
    customer_name: (orderInput.customer_name || '').trim(),
    customer_phone: (orderInput.phone || orderInput.customer_phone || '').trim(),
    customer_email: (orderInput.email || orderInput.customer_email || '').trim(),
    shipping_address: (orderInput.address || orderInput.shipping_address || '').trim(),
    city: (orderInput.city || 'Nagari').trim(),
    state: (orderInput.state || 'Andhra Pradesh').trim(),
    pincode: (orderInput.pincode || '').trim(),
    total_amount: Number(orderInput.total || orderInput.subtotal || 0),
    discount_amount: Number(orderInput.discount || 0),
    shipping_fee: 0,
    payment_method: orderInput.payment_method || 'whatsapp_pay',
    payment_status: orderInput.payment_status || 'pending',
    order_status: orderInput.status || 'Pending',
    notes: orderInput.notes || '',
  };

  const { data: orderData, error: orderErr } = await supabaseAdmin
    .from('orders')
    .insert(payload)
    .select()
    .single();

  if (orderErr) {
    console.error('Order creation error in Supabase:', orderErr);
    return NextResponse.json({ error: orderErr.message }, { status: 500 });
  }

  if (Array.isArray(items) && items.length > 0) {
    const itemsPayload = items.map((it: any) => ({
      order_id: orderData.id,
      product_id: isValidUUID(it.product_id) ? it.product_id : null,
      product_name: it.product_name || 'Item',
      size: it.size || 'Free Size',
      color: it.color || 'Default',
      quantity: Number(it.quantity) || 1,
      unit_price: Number(it.unit_price) || 0,
      total_price: Number(it.total_price) || 0,
      product_image: it.image_url || it.product_image || '',
    }));

    const { error: itemsErr } = await supabaseAdmin.from('order_items').insert(itemsPayload);
    if (itemsErr) {
      console.warn('Order items insert warning:', itemsErr);
    }
  }

  // Refetch full order with items
  const { data: fullOrder } = await supabaseAdmin
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .eq('id', orderData.id)
    .single();

  const mapped = fullOrder ? mapSupabaseOrder(fullOrder) : mapSupabaseOrder(orderData);
  return NextResponse.json({ success: true, order: mapped });
}
