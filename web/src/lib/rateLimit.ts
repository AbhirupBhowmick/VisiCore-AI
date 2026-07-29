import { NextResponse } from 'next/server';

interface RateLimitStore {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitStore>();

// Clean up expired records every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of store.entries()) {
    if (now > record.resetTime) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000);

export function checkRateLimit(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60 * 1000
): { allowed: boolean; remaining: number; resetSec: number } {
  const now = Date.now();
  const record = store.get(identifier);

  if (!record || now > record.resetTime) {
    store.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return { allowed: true, remaining: limit - 1, resetSec: Math.ceil(windowMs / 1000) };
  }

  if (record.count >= limit) {
    const resetSec = Math.ceil((record.resetTime - now) / 1000);
    return { allowed: false, remaining: 0, resetSec };
  }

  record.count += 1;
  const resetSec = Math.ceil((record.resetTime - now) / 1000);
  return { allowed: true, remaining: limit - record.count, resetSec };
}

export function rateLimitResponse(resetSec: number) {
  return NextResponse.json(
    { message: `Too many requests. Please wait ${resetSec} second${resetSec > 1 ? 's' : ''} before trying again.` },
    {
      status: 429,
      headers: {
        'Retry-After': String(resetSec),
      },
    }
  );
}
