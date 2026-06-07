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
    const formData = await request.formData();
    const file = formData.get('file');
    const result = await examService.uploadStudentList(file, id);
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
    const { id } = await params;
    const body = await request.json();
    const result = await examService.appendStudents(id, body.students);
    return NextResponse.json(result);
  } catch (error) {
    return handleServiceError(error);
  }
}
