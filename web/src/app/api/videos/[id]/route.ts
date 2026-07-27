import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
import { deleteFromMinio, BUCKET_NAME } from '@/lib/minio';

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const params = await props.params;
    const { id } = params;

    const res = await query(
      `SELECT 
        v.id, v.title, v.status, v.minio_url, v.duration, v.created_at,
        t.id AS transcript_id, t.content AS transcript_content, t.timestamps AS transcript_timestamps,
        s.id AS summary_id, s.short_summary, s.detailed_summary
      FROM videos v
      LEFT JOIN transcripts t ON v.id = t.video_id
      LEFT JOIN summaries s ON v.id = s.video_id
      WHERE v.id = $1`,
      [id]
    );

    if (res.rows.length === 0) {
      return NextResponse.json({ message: 'Video not found' }, { status: 404 });
    }

    const row = res.rows[0];
    const video = {
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
    };

    return NextResponse.json(video, { status: 200 });
  } catch (error: unknown) {
    console.error('Get video by ID error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const params = await props.params;
    const { id } = params;

    const res = await query('SELECT id, user_id, minio_url FROM videos WHERE id = $1', [id]);
    if (res.rows.length === 0) {
      return NextResponse.json({ message: 'Video not found' }, { status: 404 });
    }

    const video = res.rows[0];
    if (video.user_id !== user.id) {
      return NextResponse.json({ message: 'Unauthorized to delete this video' }, { status: 403 });
    }

    const url = video.minio_url;
    const bucketPrefix = `/${BUCKET_NAME}/`;
    if (url && url.startsWith(bucketPrefix)) {
      const objectName = url.substring(bucketPrefix.length);
      await deleteFromMinio(objectName);
    }

    await query('DELETE FROM videos WHERE id = $1', [id]);

    return new NextResponse(null, { status: 204 });
  } catch (error: unknown) {
    console.error('Delete video error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ message }, { status: 500 });
  }
}
