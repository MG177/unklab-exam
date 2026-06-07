import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect';
import { requireAuth } from '@/lib/auth/requireAuth';
import * as questionsService from '@/lib/services/questions.service';

export async function GET(request, { params }) {
  const auth = await requireAuth(request, { role: 'admin' });
  if (auth.error) return auth.error;

  await connectDB();

  const { id } = await params;
  const result = await questionsService.findOne(id);
  return NextResponse.json(result);
}

export async function DELETE(request, { params }) {
  const auth = await requireAuth(request, { role: 'admin' });
  if (auth.error) return auth.error;

  await connectDB();

  const { id } = await params;
  const result = await questionsService.remove(id);
  return NextResponse.json(result);
}
