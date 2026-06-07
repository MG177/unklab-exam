import { MAX_UPLOAD_BYTES } from './constants';

const FILE_FIELD = 'file';

/**
 * Parse multipart form data from a Next.js Request.
 * Reads the file field into memory (no disk writes).
 *
 * @returns {{ name: string, mimetype: string, buffer: Buffer }}
 * @throws {{ status: number, message: string }}
 */
export async function parseMultipart(request) {
  let formData;
  try {
    formData = await request.formData();
  } catch {
    throw { status: 400, message: 'Invalid multipart form data' };
  }

  const entry = formData.get(FILE_FIELD);
  if (!entry || typeof entry === 'string') {
    throw { status: 400, message: 'File not found' };
  }

  const name = entry.name || 'upload';
  const mimetype = entry.type || 'application/octet-stream';

  const contentLength = request.headers.get('content-length');
  if (contentLength && Number(contentLength) > MAX_UPLOAD_BYTES) {
    throw { status: 413, message: 'File too large' };
  }

  const arrayBuffer = await entry.arrayBuffer();
  if (arrayBuffer.byteLength > MAX_UPLOAD_BYTES) {
    throw { status: 413, message: 'File too large' };
  }

  return {
    name,
    mimetype,
    buffer: Buffer.from(arrayBuffer),
  };
}
