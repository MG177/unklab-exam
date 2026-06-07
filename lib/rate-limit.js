/**
 * In-memory rate limiter for single-region / dev use.
 * Resets on server cold start — not suitable for multi-instance production
 * without a shared store (e.g. Redis / Upstash).
 */
const buckets = new Map();

export function isRateLimited(key, limit = 10, windowMs = 60_000) {
  const now = Date.now();
  let bucket = buckets.get(key);

  if (!bucket || now - bucket.windowStart >= windowMs) {
    buckets.set(key, { count: 1, windowStart: now });
    return false;
  }

  bucket.count += 1;
  return bucket.count > limit;
}

export function getClientIp(request) {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

export function loginRateLimitResponse() {
  return {
    statusCode: 429,
    message: 'ThrottlerException: Too Many Requests',
  };
}
