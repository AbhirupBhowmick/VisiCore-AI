import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const [userCountRes, videoStatsRes, failedJobsRes] = await Promise.all([
      query('SELECT COUNT(*) AS count FROM users'),
      query(`
        SELECT 
          COUNT(*) AS total,
          COUNT(*) FILTER (WHERE status = 'COMPLETED') AS completed,
          COUNT(*) FILTER (WHERE status = 'PROCESSING' OR status = 'UPLOAD_PENDING') AS processing,
          COUNT(*) FILTER (WHERE status = 'FAILED') AS failed
        FROM videos
        WHERE user_id = $1
      `, [user.id]),
      query(`
        SELECT id, title, status, minio_url, created_at
        FROM videos
        WHERE user_id = $1 AND status = 'FAILED'
        ORDER BY created_at DESC
        LIMIT 10
      `, [user.id]),
    ]);

    const totalUsers = parseInt(userCountRes.rows[0]?.count || '1', 10);
    const videoStats = videoStatsRes.rows[0] || { total: '0', completed: '0', processing: '0', failed: '0' };
    const failedJobs = failedJobsRes.rows.map((row) => ({
      id: row.id,
      title: row.title,
      status: row.status,
      minioUrl: row.minio_url,
      createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
    }));

    return NextResponse.json(
      {
        systemStatus: 'System Healthy',
        version: 'v2.5.0-enterprise',
        stats: {
          totalUsers,
          totalVideos: parseInt(videoStats.total, 10),
          completedVideos: parseInt(videoStats.completed, 10),
          processingVideos: parseInt(videoStats.processing, 10),
          failedVideos: parseInt(videoStats.failed, 10),
        },
        failedJobs,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Admin telemetry API error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ message }, { status: 500 });
  }
}
