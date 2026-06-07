import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect';
import { File } from '@/lib/models/File';
import { parseMultipart } from '@/lib/upload/parseMultipart';

export async function POST(request) {
  let parsed;
  try {
    parsed = await parseMultipart(request);
  } catch (err) {
    const status = err.status || 400;
    const message = err.message || 'Bad request';
    return NextResponse.json({ message }, { status });
  }

  const { name, mimetype, buffer } = parsed;
  const base64 = buffer.toString('base64');

  await connectDB();

  const doc = await File.create({
    name,
    base64,
    type: mimetype,
  });

  return NextResponse.json({
    id: doc._id.toString(),
    name: doc.name,
    type: doc.type,
  });
}
