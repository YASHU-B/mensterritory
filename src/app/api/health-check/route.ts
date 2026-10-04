import { NextResponse } from 'next/server';

export async function GET() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const rawAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const rawService = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  const cleanUrl = rawUrl.trim().replace(/^["']|["']$/g, '');
  const cleanKey = (rawService || rawAnon).trim().replace(/^["']|["']$/g, '');

  let fetchError = null;
  let fetchStatus = null;
  let categoriesCount = 0;

  try {
    const res = await fetch(`${cleanUrl}/rest/v1/categories?select=id,name`, {
      headers: {
        apikey: cleanKey,
        Authorization: `Bearer ${cleanKey}`,
      },
      cache: 'no-store',
    });
    fetchStatus = res.status;
    if (res.ok) {
      const data = await res.json();
      categoriesCount = Array.isArray(data) ? data.length : 0;
    } else {
      fetchError = await res.text();
    }
  } catch (err: any) {
    fetchError = err.message || String(err);
  }

  return NextResponse.json({
    hasUrl: Boolean(rawUrl),
    urlLength: rawUrl.length,
    urlStartsWithHttp: rawUrl.startsWith('http'),
    urlHasQuotes: rawUrl.startsWith('"') || rawUrl.startsWith("'"),
    urlPreview: cleanUrl.slice(0, 15) + '...' + cleanUrl.slice(-10),
    hasAnonKey: Boolean(rawAnon),
    anonKeyLength: rawAnon.length,
    hasServiceKey: Boolean(rawService),
    serviceKeyLength: rawService.length,
    fetchStatus,
    categoriesCount,
    fetchError,
  });
}
