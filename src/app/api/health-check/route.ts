import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const rawAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const rawService = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  let dbCategoriesCount = 0;
  let dbProductsCount = 0;
  let queryError = null;

  if (supabaseAdmin) {
    try {
      const [catsRes, prodsRes] = await Promise.all([
        supabaseAdmin.from('categories').select('id, name'),
        supabaseAdmin.from('products').select('id, name, slug'),
      ]);
      if (catsRes.error) queryError = catsRes.error.message;
      else dbCategoriesCount = catsRes.data?.length || 0;

      if (prodsRes.error) queryError = prodsRes.error.message;
      else dbProductsCount = prodsRes.data?.length || 0;
    } catch (err: any) {
      queryError = err.message || String(err);
    }
  }

  return NextResponse.json({
    status: supabaseAdmin ? 'connected' : 'unconfigured',
    rawUrlValue: rawUrl,
    dbCategoriesCount,
    dbProductsCount,
    queryError,
  });
}
