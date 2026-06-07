import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/requireAuth';

export async function GET(request) {
  const auth = await requireAuth(request);
  if (auth.error) {
    return auth.error;
  }

  return NextResponse.json(auth.payload);
}
