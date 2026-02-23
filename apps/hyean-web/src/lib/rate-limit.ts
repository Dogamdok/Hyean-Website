type RateLimitBucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, RateLimitBucket>();

export type RateLimitResult = {
  ok: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
};

export function checkRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now >= bucket.resetAt) {
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return {
      ok: true,
      limit,
      remaining: Math.max(0, limit - 1),
      resetAt,
    };
  }

  if (bucket.count >= limit) {
    return {
      ok: false,
      limit,
      remaining: 0,
      resetAt: bucket.resetAt,
    };
  }

  bucket.count += 1;
  buckets.set(key, bucket);
  return {
    ok: true,
    limit,
    remaining: Math.max(0, limit - bucket.count),
    resetAt: bucket.resetAt,
  };
}
