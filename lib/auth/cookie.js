import { AUTH_COOKIE_NAME, COOKIE_OPTIONS } from './constants';

export function buildSetCookieHeader(token) {
  const parts = [
    `${AUTH_COOKIE_NAME}=${encodeURIComponent(token)}`,
    `Path=${COOKIE_OPTIONS.path}`,
    `Max-Age=${COOKIE_OPTIONS.maxAge}`,
    `SameSite=${COOKIE_OPTIONS.sameSite === 'lax' ? 'Lax' : COOKIE_OPTIONS.sameSite}`,
    'HttpOnly',
  ];
  if (COOKIE_OPTIONS.secure) {
    parts.push('Secure');
  }
  return parts.join('; ');
}

export function buildClearCookieHeader() {
  const parts = [
    `${AUTH_COOKIE_NAME}=`,
    `Path=${COOKIE_OPTIONS.path}`,
    'Max-Age=0',
    `SameSite=${COOKIE_OPTIONS.sameSite === 'lax' ? 'Lax' : COOKIE_OPTIONS.sameSite}`,
    'HttpOnly',
  ];
  if (COOKIE_OPTIONS.secure) {
    parts.push('Secure');
  }
  return parts.join('; ');
}

export function getTokenFromCookieHeader(cookieHeader) {
  if (!cookieHeader) return null;
  const match = cookieHeader
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${AUTH_COOKIE_NAME}=`));
  if (!match) return null;
  return decodeURIComponent(match.slice(AUTH_COOKIE_NAME.length + 1));
}
