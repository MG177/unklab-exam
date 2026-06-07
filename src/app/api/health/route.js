import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db/connect';

export async function GET() {
  await connectDB();
  await mongoose.connection.db.admin().ping();

  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
}
