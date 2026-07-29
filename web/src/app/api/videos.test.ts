import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryResult } from 'pg';
import { GET as getVideosHandler } from './videos/route';
import { POST as uploadVideoHandler } from './videos/upload/route';
import { GET as getVideoByIdHandler, DELETE as deleteVideoByIdHandler } from './videos/[id]/route';
import * as db from '@/lib/db';
import * as auth from '@/lib/auth';
import * as minio from '@/lib/minio';
import * as rabbitmq from '@/lib/rabbitmq';

vi.mock('@/lib/db', () => ({
  query: vi.fn(),
}));

vi.mock('@/lib/minio', () => ({
  uploadToMinio: vi.fn().mockResolvedValue('/aivideo/sample-video.mp4'),
  deleteFromMinio: vi.fn().mockResolvedValue(undefined),
  BUCKET_NAME: 'aivideo',
}));

vi.mock('@/lib/rabbitmq', () => ({
  publishVideoTask: vi.fn().mockResolvedValue(true),
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

describe('Video Route Handlers', () => {
  const testUser = { id: 'user-uuid-1', email: 'test@example.com', role: 'USER' };
  const validToken = auth.generateToken(testUser);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/videos', () => {
    it('returns 401 when request is unauthenticated', async () => {
      const req = new Request('http://localhost:3000/api/videos', { method: 'GET' });
      const res = await getVideosHandler(req);
      expect(res.status).toBe(401);
    });

    it('returns user videos array when authenticated', async () => {
      vi.mocked(db.query).mockResolvedValueOnce(
        mockQueryResult([
          {
            id: 'video-1',
            title: 'Sample Video',
            status: 'COMPLETED',
            minio_url: '/aivideo/v1.mp4',
            duration: 120,
            created_at: new Date().toISOString(),
            transcript_id: 't-1',
            transcript_content: 'Hello world transcript',
            transcript_timestamps: [{ start: 0, end: 5, text: 'Hello' }],
            summary_id: 's-1',
            short_summary: 'TLDR summary',
            detailed_summary: 'Detailed summary text',
          },
        ])
      );

      const req = new Request('http://localhost:3000/api/videos', {
        method: 'GET',
        headers: { Authorization: `Bearer ${validToken}` },
      });
      const res = await getVideosHandler(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(Array.isArray(json)).toBe(true);
      expect(json.length).toBe(1);
      expect(json[0].id).toBe('video-1');
      expect(json[0].transcript.content).toBe('Hello world transcript');
    });
  });

  describe('POST /api/videos/upload', () => {
    it('returns 401 when unauthenticated', async () => {
      const formData = new FormData();
      formData.append('title', 'Demo Video');
      const req = new Request('http://localhost:3000/api/videos/upload', {
        method: 'POST',
        body: formData,
      });
      const res = await uploadVideoHandler(req);
      expect(res.status).toBe(401);
    });

    it('uploads video to MinIO, saves DB record, and publishes task to RabbitMQ', async () => {
      vi.mocked(db.query).mockResolvedValueOnce(mockQueryResult([]));

      const file = new File(['fake video stream'], 'test.mp4', { type: 'video/mp4' });
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', 'Demo Video Upload');

      const req = new Request('http://localhost:3000/api/videos/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${validToken}` },
        body: formData,
      });

      const res = await uploadVideoHandler(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.title).toBe('Demo Video Upload');
      expect(json.status).toBe('UPLOAD_PENDING');
      expect(minio.uploadToMinio).toHaveBeenCalled();
      expect(rabbitmq.publishVideoTask).toHaveBeenCalled();
    });
  });

  describe('GET & DELETE /api/videos/[id]', () => {
    it('GET returns 401 when request is unauthenticated', async () => {
      const req = new Request('http://localhost:3000/api/videos/some-id');
      const res = await getVideoByIdHandler(req, { params: { id: 'some-id' } });
      expect(res.status).toBe(401);
    });

    it('GET returns 404 if video is missing', async () => {
      vi.mocked(db.query).mockResolvedValueOnce(mockQueryResult([]));
      const req = new Request('http://localhost:3000/api/videos/nonexistent-id', {
        headers: { Authorization: `Bearer ${validToken}` },
      });
      const res = await getVideoByIdHandler(req, { params: { id: 'nonexistent-id' } });
      expect(res.status).toBe(404);
    });

    it('DELETE returns 204 when video is successfully deleted', async () => {
      vi.mocked(db.query)
        .mockResolvedValueOnce(
          mockQueryResult([{ id: 'v-123', user_id: 'user-uuid-1', minio_url: '/aivideo/v123.mp4' }])
        ) // video check
        .mockResolvedValueOnce(mockQueryResult([])); // delete query

      const req = new Request('http://localhost:3000/api/videos/v-123', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${validToken}` },
      });
      const res = await deleteVideoByIdHandler(req, { params: { id: 'v-123' } });
      expect(res.status).toBe(204);
      expect(minio.deleteFromMinio).toHaveBeenCalledWith('v123.mp4');
    });
  });
});
