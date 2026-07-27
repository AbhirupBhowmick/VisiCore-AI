import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { comparePassword, hashPassword } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, currentPassword, newPassword } = body;

    if (!email || !email.trim()) {
      return NextResponse.json({ message: 'User email is required' }, { status: 400 });
    }
    if (!currentPassword || !currentPassword.trim()) {
      return NextResponse.json({ message: 'Current password is required' }, { status: 400 });
    }
    if (!newPassword || !newPassword.trim()) {
      return NextResponse.json({ message: 'New password is required' }, { status: 400 });
    }

    const res = await query('SELECT id, password_hash FROM users WHERE email = $1', [email]);
    if (res.rows.length === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 400 });
    }

    const user = res.rows[0];
    const matches = await comparePassword(currentPassword, user.password_hash);
    if (!matches) {
      return NextResponse.json({ message: 'Current password does not match' }, { status: 400 });
    }

    const newPasswordHash = await hashPassword(newPassword);
    await query('UPDATE users SET password_hash = $1 WHERE id = $2', [newPasswordHash, user.id]);

    return NextResponse.json({ message: 'Password successfully updated' }, { status: 200 });
  } catch (error: unknown) {
    console.error('Change password error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ message }, { status: 500 });
  }
}
