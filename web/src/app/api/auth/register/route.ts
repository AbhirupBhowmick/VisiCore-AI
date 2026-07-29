import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { query } from '@/lib/db';
import { hashPassword, generateToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, role } = body;

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return NextResponse.json({ message: 'Email already in use' }, { status: 400 });
    }

    const id = uuidv4();
    const apiKey = `vc_live_${uuidv4().replace(/-/g, '')}`;
    const userRole = role || 'USER';
    const passwordHash = await hashPassword(password);

    await query(
      'INSERT INTO users (id, email, password_hash, role, api_key, created_at) VALUES ($1, $2, $3, $4, $5, NOW())',
      [id, email, passwordHash, userRole, apiKey]
    );

    const token = generateToken({ id, email, role: userRole });
    return NextResponse.json({ token }, { status: 200 });
  } catch (error: unknown) {
    console.error('Registration error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ message }, { status: 500 });
  }
}
