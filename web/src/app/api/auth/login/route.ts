import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { comparePassword, generateToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    const res = await query('SELECT id, email, password_hash, role FROM users WHERE email = $1', [email]);
    if (res.rows.length === 0) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 400 });
    }

    const user = res.rows[0];
    const passwordMatch = await comparePassword(password, user.password_hash);
    if (!passwordMatch) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 400 });
    }

    const token = generateToken({ id: user.id, email: user.email, role: user.role });
    return NextResponse.json({ token }, { status: 200 });
  } catch (error: unknown) {
    console.error('Login error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ message }, { status: 500 });
  }
}
