import imageCompression from 'browser-image-compression';
import {
  MAX_COMPRESSED_IMAGE_BYTES,
  MAX_COMPRESSED_IMAGE_MB,
} from '@/lib/upload/constants';

/**
 * Compress an image before POST /api/file (Lane N).
 * Target ≤ 500 KB, max dimension ~1200px, JPEG output when beneficial.
 */
export async function compressImageForUpload(file) {
  if (!file?.type?.startsWith('image/')) {
    throw new Error('Please choose an image file');
  }

  const compressed = await imageCompression(file, {
    maxSizeMB: MAX_COMPRESSED_IMAGE_MB,
    maxWidthOrHeight: 1200,
    useWebWorker: true,
    initialQuality: 0.85,
    fileType: 'image/jpeg',
  });

  if (compressed.size > MAX_COMPRESSED_IMAGE_BYTES) {
    throw new Error(
      `Image is still too large after compression (${Math.round(compressed.size / 1024)} KB). Use a smaller or simpler image.`
    );
  }

  return compressed;
}
