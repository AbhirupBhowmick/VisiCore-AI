import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryResult } from 'pg';
import { POST as registerHandler } from './auth/register/route';
import { POST as loginHandler } from './auth/login/route';
import { POST as changePasswordHandler } from './auth/change-password/route';
import { GET as meHandler } from './auth/me/route';
import * as db from '@/lib/db';
import * as auth from '@/lib/auth';

vi.mock('@/lib/db', () => ({
  query: vi.fn(),
}));

function mockQueryResult(rows: Record<string, unknown>[] = []): QueryResult {
  return {
    rows,
    command: '',
    rowCount: rows.length,
    oid: 0,
    fields: [],
  };
}

describe('Auth Route Handlers', () => {
  const testUser = { id: 'user-123', email: 'test@example.com', role: 'USER' };
  const validToken = auth.generateToken(testUser);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/auth/me', () => {
    it('returns 401 when request is unauthenticated', async () => {
      const req = new Request('http://localhost:3000/api/auth/me', { method: 'GET' });
      const res = await meHandler(req);
      expect(res.status).toBe(401);
    });

    it('returns user profile when authenticated', async () => {
      vi.mocked(db.query).mockResolvedValueOnce(
        mockQueryResult([{ id: 'user-123', email: 'test@example.com', role: 'USER', api_key: 'vc_live_123', created_at: new Date() }])
      );

      const req = new Request('http://localhost:3000/api/auth/me', {
        method: 'GET',
        headers: { Authorization: `Bearer ${validToken}` },
      });
      const res = await meHandler(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.email).toBe('test@example.com');
      expect(json.apiKey).toBe('vc_live_123');
    });
  });

  describe('POST /api/auth/register', () => {
    it('returns 400 when email or password is missing', async () => {
      const req = new Request('http://localhost:3000/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email: 'test@example.com' }),
      });
      const res = await registerHandler(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.message).toContain('required');
    });

    it('returns 400 when email is already in use', async () => {
      vi.mocked(db.query).mockResolvedValueOnce(mockQueryResult([{ id: 'existing-id' }]));
      const req = new Request('http://localhost:3000/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email: 'test@example.com', password: 'password123' }),
      });
      const res = await registerHandler(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.message).toBe('Email already in use');
    });

    it('returns 200 with token when registration succeeds', async () => {
      vi.mocked(db.query)
        .mockResolvedValueOnce(mockQueryResult([])) // email check
        .mockResolvedValueOnce(mockQueryResult([])); // insert

      const req = new Request('http://localhost:3000/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email: 'new@example.com', password: 'password123' }),
      });
      const res = await registerHandler(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json).toHaveProperty('token');
      expect(typeof json.token).toBe('string');
    });
  });

  describe('POST /api/auth/login', () => {
    it('returns 400 when user is not found', async () => {
      vi.mocked(db.query).mockResolvedValueOnce(mockQueryResult([]));
      const req = new Request('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: 'wrong@example.com', password: 'password123' }),
      });
      const res = await loginHandler(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.message).toBe('Invalid email or password');
    });

    it('returns 200 with token when credentials are valid', async () => {
      const hashedPassword = await auth.hashPassword('password123');
      vi.mocked(db.query).mockResolvedValueOnce(
        mockQueryResult([{ id: 'user-123', email: 'test@example.com', password_hash: hashedPassword, role: 'USER' }])
      );

      const req = new Request('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: 'test@example.com', password: 'password123' }),
      });
      const res = await loginHandler(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json).toHaveProperty('token');
    });
  });

  describe('POST /api/auth/change-password', () => {
    it('updates password when current password matches', async () => {
      const hashedPassword = await auth.hashPassword('oldpass');
      vi.mocked(db.query)
        .mockResolvedValueOnce(mockQueryResult([{ id: 'user-123', password_hash: hashedPassword }])) // fetch user
        .mockResolvedValueOnce(mockQueryResult([])); // update password

      const req = new Request('http://localhost:3000/api/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          currentPassword: 'oldpass',
          newPassword: 'newpass123',
        }),
      });
      const res = await changePasswordHandler(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.message).toBe('Password successfully updated');
    });
  });
});
