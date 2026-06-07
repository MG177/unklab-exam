import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/requireAuth';
import { signUp } from '@/lib/auth/signIn';

export async function POST(request) {
  const auth = await requireAdmin(request);
  if (auth.error) {
    return auth.error;
  }

  const body = await request.json();
  const result = await signUp(body);

  if (result.error) {
    return NextResponse.json(
      { statusCode: result.status, message: result.message },
      { status: result.status }
    );
  }

  return NextResponse.json(result.body, { status: result.status });
}
