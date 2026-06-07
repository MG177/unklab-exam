import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect';
import * as examService from '@/lib/services/exam.service';
import { handleServiceError, requireAuth } from '../../_lib/requireAuth';

export async function PATCH(request, { params }) {
  const auth = await requireAuth(request, { admin: true });
  if (auth.error) return auth.error;

  try {
    await connectDB();
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    let minute = Number(searchParams.get('minute'));
    const token = searchParams.get('token');

    if (!minute) {
      minute = 65;
    }

    const exam = await examService.start(id, minute, token);
    const time = await examService.countTime(id);
    return NextResponse.json({ token: exam.token, time });
  } catch (error) {
    return handleServiceError(error);
  }
}
