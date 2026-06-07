import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect';
import * as examService from '@/lib/services/exam.service';
import { handleServiceError, requireAuth } from '../_lib/requireAuth';

export async function GET(request, { params }) {
  const auth = await requireAuth(request, { admin: true });
  if (auth.error) return auth.error;

  try {
    await connectDB();
    const { id } = await params;
    const exam = await examService.findOneByID(id);
    return NextResponse.json(exam);
  } catch (error) {
    return handleServiceError(error);
  }
}

export async function PATCH(request, { params }) {
  const auth = await requireAuth(request, { admin: true });
  if (auth.error) return auth.error;

  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    if (body.questions) {
      body.questions = await examService.verifyQuestionInfo(body.questions);
    }
    const result = await examService.update(id, body);
    return NextResponse.json(result);
  } catch (error) {
    return handleServiceError(error);
  }
}

export async function DELETE(request, { params }) {
  const auth = await requireAuth(request, { admin: true });
  if (auth.error) return auth.error;

  try {
    await connectDB();
    const { id } = await params;
    const result = await examService.remove(id);
    return NextResponse.json(result);
  } catch (error) {
    return handleServiceError(error);
  }
}

export async function POST(request, { params }) {
  const auth = await requireAuth(request, { admin: true });
  if (auth.error) return auth.error;

  try {
    await connectDB();
    const { id: examName } = await params;
    const body = await request.json();
    const verifiedData = await examService.verifyQuestionInfo(body);
    const result = await examService.create(verifiedData, examName);
    return NextResponse.json(result);
  } catch (error) {
    return handleServiceError(error);
  }
}
