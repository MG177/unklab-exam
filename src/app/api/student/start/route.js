import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/requireAuth';
import { handleServiceError } from '@/lib/http/errors';
import { startStudent } from '@/lib/services/student.service';

export async function POST(request) {
  const auth = await requireAuth(request, 'student');
  if (auth.error) return auth.error;

  try {
    const data = await startStudent(auth.payload);
    const hasScore = data.score !== null && data.score !== undefined;
    const alreadyFinished = hasScore || data.isSubmitted;
    return NextResponse.json(!alreadyFinished);
  } catch (err) {
    return handleServiceError(err);
  }
}
