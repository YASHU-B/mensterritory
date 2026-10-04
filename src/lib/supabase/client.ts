import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://jzdqflgibyfayfefmaxl.supabase.co';

function sanitizeUrl(val?: string): string {
  if (!val) return DEFAULT_SUPABASE_URL;
  let cleaned = val.trim().replace(/^["']|["']$/g, '').trim();
  if (
    !cleaned || 
    cleaned === 'NEXT_PUBLIC_SUPABASE_URL' || 
    cleaned.includes('your-project-id')
  ) {
    return DEFAULT_SUPABASE_URL;
  }
  if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
    if (cleaned.includes('.supabase.co')) {
      cleaned = `https://${cleaned}`;
    } else {
      cleaned = `https://${cleaned}.supabase.co`;
    }
  }
  return cleaned.replace(/\/+$/, '');
}

function sanitizeKey(val?: string): string {
  if (!val) return '';
  return val.trim().replace(/^["']|["']$/g, '').trim();
}

const supabaseUrl = sanitizeUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
const supabaseAnonKey = sanitizeKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  (supabaseUrl.startsWith('http://') || supabaseUrl.startsWith('https://')) &&
  !supabaseUrl.includes('your-project-id') &&
  !supabaseAnonKey.includes('your-anon-key')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
