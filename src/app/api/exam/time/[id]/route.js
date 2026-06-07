import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect';
import * as examService from '@/lib/services/exam.service';
import { handleServiceError, requireAuth } from '../../_lib/requireAuth';

export async function GET(request, { params }) {
  const auth = await requireAuth(request);
  if (auth.error) return auth.error;

  try {
    await connectDB();
    const { id } = await params;
    const time = await examService.countTime(id);
    return NextResponse.json(time);
  } catch (error) {
    return handleServiceError(error);
  }
}
