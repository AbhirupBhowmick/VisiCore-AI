import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { query } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
import { uploadToMinio } from '@/lib/minio';
import { publishVideoTask } from '@/lib/rabbitmq';
import { checkRateLimit, rateLimitResponse } from '@/lib/rateLimit';
import { logger, generateRequestId } from '@/lib/logger';

const MAX_FILE_SIZE_BYTES = 500 * 1024 * 1024; // 500 MB limit
const ALLOWED_EXTENSIONS = ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.m4v'];

export async function POST(request: Request) {
  const reqId = generateRequestId();
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      logger.warn('Unauthorized video upload attempt', {}, reqId);
      return NextResponse.json({ message: 'Unauthorized access' }, { status: 401 });
    }

    // Rate limit: Max 10 uploads per minute per user
    const rateCheck = checkRateLimit(`upload_${user.id}`, 10, 60 * 1000);
    if (!rateCheck.allowed) {
      logger.warn('Video upload rate limit exceeded', { userId: user.id }, reqId);
      return rateLimitResponse(rateCheck.resetSec);
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const title = formData.get('title') as string | null;

    if (!file || !title || !title.trim()) {
      logger.warn('Upload missing file or title', { userId: user.id }, reqId);
      return NextResponse.json({ message: 'Both video file and title are required.' }, { status: 400 });
    }

    // File Validation: Size limit
    if (file.size > MAX_FILE_SIZE_BYTES) {
      logger.warn('Upload exceeds size limit', { filename: file.name, size: file.size }, reqId);
      return NextResponse.json(
        { message: `File size exceeds maximum allowed limit of 500 MB. (Your file: ${(file.size / (1024 * 1024)).toFixed(1)} MB)` },
        { status: 400 }
      );
    }

    // File Validation: Extension & MIME type
    const lowerName = file.name.toLowerCase();
    const hasValidExtension = ALLOWED_EXTENSIONS.some((ext) => lowerName.endsWith(ext));
    const isVideoMime = file.type.startsWith('video/') || file.type === 'application/octet-stream' || file.type === 'application/mp4';

    if (!hasValidExtension && !isVideoMime) {
      logger.warn('Upload invalid file format', { filename: file.name, mime: file.type }, reqId);
      return NextResponse.json(
        { message: 'Invalid video file format. Supported formats: .mp4, .mov, .avi, .mkv, .webm' },
        { status: 400 }
      );
    }

    logger.info('Processing video upload', { userId: user.id, filename: file.name, size: file.size }, reqId);

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const safeFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const objectName = `uploads/${uuidv4()}-${safeFilename}`;
    const contentType = file.type || 'video/mp4';

    const minioUrl = await uploadToMinio(objectName, fileBuffer, contentType);

    const videoId = uuidv4();
    const now = new Date();

    await query(
      'INSERT INTO videos (id, user_id, title, status, minio_url, created_at) VALUES ($1, $2, $3, $4, $5, $6)',
      [videoId, user.id, title.trim(), 'UPLOAD_PENDING', minioUrl, now]
    );

    // Enqueue for background AI analysis
    const published = await publishVideoTask(videoId, minioUrl);
    if (!published) {
      logger.warn('Failed to publish video task to queue', { videoId }, reqId);
    }

    logger.info('Video upload completed successfully', { videoId, title: title.trim() }, reqId);

    const videoDto = {
      id: videoId,
      title: title.trim(),
      status: 'UPLOAD_PENDING',
      minioUrl: minioUrl,
      duration: null,
      createdAt: now.toISOString(),
      transcript: null,
      summary: null,
    };

    return NextResponse.json(videoDto, { status: 200 });
  } catch (error: unknown) {
    logger.error('Video upload processing failed', error, {}, reqId);
    const message = error instanceof Error ? error.message : 'Failed to process video upload. Please try again.';
    return NextResponse.json({ message }, { status: 500 });
  }
}
