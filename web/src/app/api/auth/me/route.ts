import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { query } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const userPayload = getUserFromRequest(request);
    if (!userPayload) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const res = await query(
      'SELECT id, email, role, api_key, created_at FROM users WHERE id = $1',
      [userPayload.id]
    );

    if (res.rows.length === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    let user = res.rows[0];

    // If existing user has no api_key yet, auto-assign one
    if (!user.api_key) {
      const generatedKey = `vc_live_${uuidv4().replace(/-/g, '')}`;
      await query('UPDATE users SET api_key = $1 WHERE id = $2', [generatedKey, user.id]);
      user.api_key = generatedKey;
    }

    return NextResponse.json(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        apiKey: user.api_key,
        createdAt: user.created_at ? new Date(user.created_at).toISOString() : new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Get user profile error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ message }, { status: 500 });
  }
}
