import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
import { publishVideoTask } from '@/lib/rabbitmq';

export async function POST(
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
      return NextResponse.json({ message: 'Unauthorized to retry this video' }, { status: 403 });
    }

    // Reset status back to UPLOAD_PENDING
    await query("UPDATE videos SET status = 'UPLOAD_PENDING' WHERE id = $1", [id]);

    // Re-publish to RabbitMQ queue
    await publishVideoTask(video.id, video.minio_url);

    return NextResponse.json({ message: 'Video job successfully re-queued' }, { status: 200 });
  } catch (error: unknown) {
    console.error('Retry video job error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ message }, { status: 500 });
  }
}
