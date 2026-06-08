/** Server hard cap for multipart uploads (CSV, XLSX, audio). */
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

/** Target max size after client-side image compression (Lane N). */
export const MAX_COMPRESSED_IMAGE_BYTES = 500 * 1024;

export const MAX_COMPRESSED_IMAGE_MB = MAX_COMPRESSED_IMAGE_BYTES / (1024 * 1024);

export const MAX_UPLOAD_MB = MAX_UPLOAD_BYTES / (1024 * 1024);
