export const ADMIN_COOKIE_NAME = 'mt_admin_token';
const DEFAULT_SECRET = 'mt_secure_session_secret_territory_2026_x89a';

function getSecret(): string {
  return process.env.ADMIN_JWT_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || DEFAULT_SECRET;
}

export interface AdminSessionPayload {
  email: string;
  role: 'super_admin' | 'admin';
  name: string;
  exp: number; // expiration timestamp in ms
}

async function getHmacKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

function bufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlToBuffer(base64url: string): Uint8Array {
  let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function stringToBase64Url(str: string): string {
  const enc = new TextEncoder();
  return bufferToBase64Url(enc.encode(str).buffer);
}

function base64UrlToString(base64url: string): string {
  const bytes = base64UrlToBuffer(base64url);
  const dec = new TextDecoder();
  return dec.decode(bytes);
}

/**
 * Creates a cryptographically signed HMAC-SHA256 session token using Edge-compatible Web Crypto
 */
export async function createSessionToken(email: string, name = 'Store Administrator'): Promise<string> {
  const secret = getSecret();
  const exp = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days expiration
  const payload: AdminSessionPayload = {
    email: email.toLowerCase().trim(),
    role: 'super_admin',
    name,
    exp,
  };

  const payloadStr = JSON.stringify(payload);
  const payloadB64 = stringToBase64Url(payloadStr);

  const key = await getHmacKey(secret);
  const enc = new TextEncoder();
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, enc.encode(payloadB64));
  const signature = bufferToBase64Url(signatureBuffer);

  return `${payloadB64}.${signature}`;
}

/**
 * Validates the HMAC signature and expiration using Edge-compatible Web Crypto
 */
export async function verifySessionToken(token?: string | null): Promise<AdminSessionPayload | null> {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payloadB64, signature] = parts;
  const secret = getSecret();

  try {
    const key = await getHmacKey(secret);
    const enc = new TextEncoder();
    const signatureBytes = base64UrlToBuffer(signature);
    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      signatureBytes as unknown as BufferSource,
      enc.encode(payloadB64)
    );

    if (!isValid) return null;

    const payloadStr = base64UrlToString(payloadB64);
    const payload: AdminSessionPayload = JSON.parse(payloadStr);
    if (payload.exp < Date.now()) {
      return null; // Expired
    }
    return payload;
  } catch {
    return null;
  }
}
