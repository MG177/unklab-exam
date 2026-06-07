import { NextResponse } from 'next/server';
import { buildClearCookieHeader } from '@/lib/auth/cookie';

export async function POST() {
  const response = NextResponse.json({ status: 'ok' });
  response.headers.set('Set-Cookie', buildClearCookieHeader());
  return response;
}
