import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { query } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
import { getMinioObjectStat } from '@/lib/minio';
import { publishVideoTask } from '@/lib/rabbitmq';
import { logger, generateRequestId } from '@/lib/logger';

export async function POST(request: Request) {
  const reqId = generateRequestId();
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      logger.warn('Unauthorized upload complete attempt', {}, reqId);
      return NextResponse.json({ message: 'Unauthorized access' }, { status: 401 });
    }

    const body = await request.json();
    const { objectKey, minioUrl: providedMinioUrl, title } = body;

    if ((!objectKey && !providedMinioUrl) || !title || !title.trim()) {
      logger.warn('Upload complete missing required params', { userId: user.id }, reqId);
      return NextResponse.json({ message: 'Object key and video title are required.' }, { status: 400 });
    }

    const targetKey = objectKey || providedMinioUrl;

    // Verify uploaded object exists in R2 / MinIO storage
    try {
      const stat = await getMinioObjectStat(targetKey);
      if (!stat || stat.size === 0) {
        logger.warn('Upload complete object empty or missing', { targetKey }, reqId);
        return NextResponse.json({ message: 'Uploaded video file was not found in storage.' }, { status: 400 });
      }
    } catch (statError) {
      logger.warn('Upload complete object verification failed', { targetKey, error: String(statError) }, reqId);
      return NextResponse.json(
        { message: 'Failed to verify uploaded video file in storage. Please ensure upload completed successfully.' },
        { status: 400 }
      );
    }

    const videoId = uuidv4();
    const now = new Date();
    const finalMinioUrl = providedMinioUrl || (targetKey.startsWith('/') ? targetKey : `/${targetKey}`);

    await query(
      'INSERT INTO videos (id, user_id, title, status, minio_url, created_at) VALUES ($1, $2, $3, $4, $5, $6)',
      [videoId, user.id, title.trim(), 'UPLOAD_PENDING', finalMinioUrl, now]
    );

    // Enqueue for background AI analysis
    const published = await publishVideoTask(videoId, finalMinioUrl);
    if (!published) {
      logger.warn('Failed to publish task to RabbitMQ queue during upload complete', { videoId }, reqId);
    }

    logger.info('Video upload completed and registered', { videoId, title: title.trim(), finalMinioUrl }, reqId);

    const videoDto = {
      id: videoId,
      title: title.trim(),
      status: 'UPLOAD_PENDING',
      minioUrl: finalMinioUrl,
      duration: null,
      createdAt: now.toISOString(),
      transcript: null,
      summary: null,
    };

    return NextResponse.json(videoDto, { status: 200 });
  } catch (error: unknown) {
    logger.error('Upload complete failed', error, {}, reqId);
    const message = error instanceof Error ? error.message : 'Failed to finalize video record.';
    return NextResponse.json({ message }, { status: 500 });
  }
}
