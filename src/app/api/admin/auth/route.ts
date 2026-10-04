import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import {
  createSessionToken,
  verifySessionToken,
  ADMIN_COOKIE_NAME,
} from '@/lib/auth';

// In-memory sliding window rate limiter for brute-force protection
interface RateLimitRecord {
  attempts: number;
  lockoutUntil: number;
}
const rateLimits = new Map<string, RateLimitRecord>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME_MS = 15 * 60 * 1000; // 15 minutes

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.headers.get('x-real-ip') || '127.0.0.1';
}

function checkRateLimit(ip: string): { allowed: boolean; waitMinutes?: number } {
  const record = rateLimits.get(ip);
  const now = Date.now();

  if (record) {
    if (record.lockoutUntil > now) {
      const waitMinutes = Math.ceil((record.lockoutUntil - now) / 60000);
      return { allowed: false, waitMinutes };
    }
    // Lockout expired, reset
    if (record.lockoutUntil > 0 && record.lockoutUntil <= now) {
      rateLimits.delete(ip);
    }
  }

  return { allowed: true };
}

function recordFailedAttempt(ip: string) {
  const record = rateLimits.get(ip) || { attempts: 0, lockoutUntil: 0 };
  record.attempts += 1;
  if (record.attempts >= MAX_ATTEMPTS) {
    record.lockoutUntil = Date.now() + LOCKOUT_TIME_MS;
  }
  rateLimits.set(ip, record);
}

function resetRateLimit(ip: string) {
  rateLimits.delete(ip);
}

/**
 * GET /api/admin/auth - Verify active admin session
 */
export async function GET(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const session = await verifySessionToken(token);

  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      email: session.email,
      role: session.role,
      full_name: session.name,
    },
  });
}

/**
 * POST /api/admin/auth - Secure Admin Login
 */
export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rateLimitStatus = checkRateLimit(ip);

  if (!rateLimitStatus.allowed) {
    return NextResponse.json(
      {
        error: `Too many failed login attempts. For security, please wait ${rateLimitStatus.waitMinutes} minutes before trying again.`,
      },
      { status: 429 }
    );
  }

  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const email = (body.email || '').trim().toLowerCase();
  const password = body.password || '';

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }

  let isAuthenticated = false;
  let adminName = 'Store Administrator';

  // 1. Check Server Environment Admin Credentials FIRST (Instant < 1ms response)
  const envAdminEmail = (process.env.ADMIN_EMAIL || 'admin@mensterritory.com').toLowerCase().trim();
  const envAdminPassword = process.env.ADMIN_PASSWORD || 'MensTerritory@2026Secure!';

  if (email === envAdminEmail && password === envAdminPassword) {
    isAuthenticated = true;
    adminName = 'Yaswanth (Lead Administrator)';
  }

  // 2. Check Supabase Auth only if not matched, with a 3-second safety timeout
  if (!isAuthenticated && isSupabaseConfigured && supabase) {
    try {
      const authPromise = supabase.auth.signInWithPassword({
        email,
        password,
      });
      const timeoutPromise = new Promise<{ data: null; error: any }>((resolve) =>
        setTimeout(() => resolve({ data: null, error: new Error('Auth timeout') }), 3000)
      );
      const { data, error } = await Promise.race([authPromise, timeoutPromise]);

      if (!error && data?.user) {
        isAuthenticated = true;
        adminName = data.user.user_metadata?.full_name || 'Store Administrator';
      }
    } catch (e) {
      console.warn('Supabase auth attempt error:', e);
    }
  }

  if (!isAuthenticated) {
    recordFailedAttempt(ip);
    const remaining = MAX_ATTEMPTS - ((rateLimits.get(ip)?.attempts || 0) % MAX_ATTEMPTS);
    return NextResponse.json(
      {
        error:
          remaining > 0
            ? `Invalid email or password. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`
            : 'Account locked due to multiple failed attempts. Please wait 15 minutes.',
      },
      { status: 401 }
    );
  }

  // Successful authentication - reset brute force counter
  resetRateLimit(ip);

  const token = await createSessionToken(email, adminName);
  const response = NextResponse.json({
    success: true,
    user: {
      email,
      role: 'super_admin',
      full_name: adminName,
    },
  });

  // Set httpOnly secure session cookie
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });

  return response;
}

/**
 * DELETE /api/admin/auth - Secure Admin Logout
 */
export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });

  // Clear session cookie
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  return response;
}
