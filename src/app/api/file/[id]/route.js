import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db/connect';
import { File } from '@/lib/models/File';

export async function GET(_request, { params }) {
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: 'File not found' }, { status: 404 });
  }

  await connectDB();

  const file = await File.findById(id).lean();
  if (!file) {
    return NextResponse.json({ message: 'File not found' }, { status: 404 });
  }

  return NextResponse.json({
    name: file.name,
    base64: file.base64,
    type: file.type,
  });
}
