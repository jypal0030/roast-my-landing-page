// Simple in-memory rate limiter for Vercel serverless
// Resets when function cold-starts (acceptable for MVP)

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

const ANON_LIMIT = 3; // 3 roasts per day for anonymous
const AUTH_LIMIT = 50; // 50 roasts per day for logged-in users
const WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function checkRateLimit(
  identifier: string,
  isAuthenticated: boolean
): Promise<{ allowed: boolean; remaining: number; retryAfter?: number; message?: string }> {
  const now = Date.now();
  const limit = isAuthenticated ? AUTH_LIMIT : ANON_LIMIT;

  // Clean expired entries
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key);
  }

  let entry = store.get(identifier);

  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: now + WINDOW_MS };
    store.set(identifier, entry);
  }

  entry.count++;

  if (entry.count > limit) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      retryAfter,
      message: isAuthenticated
        ? `You've reached the daily limit of ${limit} roasts. Try again tomorrow.`
        : `Free users get ${limit} roasts per day. Sign in for 50/day.`,
    };
  }

  return {
    allowed: true,
    remaining: limit - entry.count,
  };
}
