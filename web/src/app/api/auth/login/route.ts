import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { comparePassword, generateToken } from '@/lib/auth';
import { checkRateLimit, rateLimitResponse } from '@/lib/rateLimit';
import { logger, generateRequestId } from '@/lib/logger';

export async function POST(request: Request) {
  const reqId = generateRequestId();
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateCheck = checkRateLimit(`login_${ip}`, 10, 60 * 1000); // 10 attempts per minute
    if (!rateCheck.allowed) {
      logger.warn('Login rate limit exceeded', { ip }, reqId);
      return rateLimitResponse(rateCheck.resetSec);
    }

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      logger.warn('Login missing email or password', { email }, reqId);
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    const res = await query('SELECT id, email, password_hash, role FROM users WHERE email = $1', [email]);
    if (res.rows.length === 0) {
      logger.warn('Login failed: user not found', { email }, reqId);
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 400 });
    }

    const user = res.rows[0];
    const passwordMatch = await comparePassword(password, user.password_hash);
    if (!passwordMatch) {
      logger.warn('Login failed: invalid password', { email }, reqId);
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 400 });
    }

    const token = generateToken({ id: user.id, email: user.email, role: user.role });
    logger.info('User login successful', { userId: user.id, email }, reqId);
    return NextResponse.json({ token }, { status: 200 });
  } catch (error: unknown) {
    logger.error('Login error', error, {}, reqId);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ message }, { status: 500 });
  }
}
