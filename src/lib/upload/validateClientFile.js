import { MAX_UPLOAD_BYTES } from './constants';

/**
 * Reject oversize files before upload (Lane O — client side).
 * @param {File} file
 * @param {string} label
 */
export function assertUploadWithinLimit(file, label = 'File') {
  if (!file) {
    throw new Error('No file selected');
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error(`${label} exceeds the ${MAX_UPLOAD_BYTES / (1024 * 1024)} MB limit`);
  }
}
