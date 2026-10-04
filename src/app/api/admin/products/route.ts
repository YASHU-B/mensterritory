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

/**
 * GET /api/admin/products - List all products directly from DB
 */
export async function GET() {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase is not configured on server' }, { status: 503 });
  }

  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ products: data });
}

/**
 * POST /api/admin/products - Create or Update product
 */
export async function POST(req: NextRequest) {
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

  const targetId = isValidUUID(body.id) ? body.id : crypto.randomUUID();
  const categoryId = isValidUUID(body.category_id) ? body.category_id : null;

  const discountPercent =
    body.original_price && body.price
      ? Math.round(((Number(body.original_price) - Number(body.price)) / Number(body.original_price)) * 100)
      : Number(body.discount_percent || 0);

  const payload = {
    id: targetId,
    name: body.name || 'Untitled Product',
    slug: body.slug || `product-${Date.now()}`,
    description: body.description || '',
    short_description: body.short_description || '',
    category_id: categoryId,
    subcategory: body.subcategory || body.category_name || '',
    price: Number(body.price) || 0,
    original_price: Number(body.original_price) || 0,
    discount_price: Number(body.discount_price || 0),
    discount_percent: discountPercent,
    sku: body.sku || `SKU-${Date.now()}`,
    brand: body.brand || "Men's Territory",
    available_sizes: Array.isArray(body.available_sizes) ? body.available_sizes : ['M', 'L', 'XL'],
    available_colors: Array.isArray(body.available_colors) ? body.available_colors : ['Default'],
    stock_quantity: Number(body.stock_quantity ?? 10),
    low_stock_threshold: Number(body.low_stock_threshold ?? 3),
    images: Array.isArray(body.images) ? body.images : (body.image ? [body.image] : []),
    thumbnail: body.thumbnail || (Array.isArray(body.images) && body.images[0]) || '',
    featured_image: body.featured_image || body.thumbnail || '',
    material: body.material || 'Cotton Blend',
    fabric: body.fabric || '100% Premium Cotton',
    fit: body.fit || 'Relaxed Fit',
    pattern: body.pattern || 'Solid',
    gender: body.gender || 'Men',
    tags: Array.isArray(body.tags) ? body.tags : [],
    is_active: body.is_active ?? true,
    is_featured: body.is_featured ?? false,
    is_best_seller: body.is_best_seller ?? false,
    is_trending: body.is_trending ?? false,
    is_new_arrival: body.is_new_arrival ?? false,
    is_offer: body.is_offer ?? false,
    display_order: Number(body.display_order ?? 0),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabaseAdmin
    .from('products')
    .upsert(payload)
    .select()
    .single();

  if (error) {
    console.error('Supabase admin products upsert error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ product: data });
}

/**
 * DELETE /api/admin/products?id=...
 */
export async function DELETE(req: NextRequest) {
  const session = await verifyAuth(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized: Admin session required' }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase is not configured on server' }, { status: 503 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from('products').delete().eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, id });
}
