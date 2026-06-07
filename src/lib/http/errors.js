import { NextResponse } from 'next/server';

export function handleServiceError(err) {
  const status = err.status || 500;
  const message = err.message || 'error';
  return NextResponse.json({ statusCode: status, message }, { status });
}
