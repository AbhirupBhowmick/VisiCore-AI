import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const res = await query(
      `SELECT 
        v.id, v.title, v.status, v.minio_url, v.duration, v.created_at,
        t.id AS transcript_id, t.content AS transcript_content, t.timestamps AS transcript_timestamps,
        s.id AS summary_id, s.short_summary, s.detailed_summary
      FROM videos v
      LEFT JOIN transcripts t ON v.id = t.video_id
      LEFT JOIN summaries s ON v.id = s.video_id
      WHERE v.user_id = $1
      ORDER BY v.created_at DESC`,
      [user.id]
    );

    const videos = res.rows.map((row) => ({
      id: row.id,
      title: row.title,
      status: row.status,
      minioUrl: row.minio_url,
      duration: row.duration,
      createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
      transcript: row.transcript_id
        ? {
            id: row.transcript_id,
            content: row.transcript_content,
            timestamps: row.transcript_timestamps,
          }
        : null,
      summary: row.summary_id
        ? {
            id: row.summary_id,
            shortSummary: row.short_summary,
            detailedSummary: row.detailed_summary,
          }
        : null,
    }));

    return NextResponse.json(videos, { status: 200 });
  } catch (error: unknown) {
    console.error('Get all videos error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ message }, { status: 500 });
  }
}
