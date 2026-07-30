import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getUserFromRequest } from '@/lib/auth';
import { generatePresignedUploadUrl } from '@/lib/minio';
import { checkRateLimit, rateLimitResponse } from '@/lib/rateLimit';
import { logger, generateRequestId } from '@/lib/logger';

const MAX_FILE_SIZE_BYTES = 500 * 1024 * 1024; // 500 MB limit
const ALLOWED_EXTENSIONS = ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.m4v'];

export async function POST(request: Request) {
  const reqId = generateRequestId();
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      logger.warn('Unauthorized upload init attempt', {}, reqId);
      return NextResponse.json({ message: 'Unauthorized access' }, { status: 401 });
    }

    // Rate limiting: Max 15 upload init requests per minute per user
    const rateCheck = checkRateLimit(`upload_init_${user.id}`, 15, 60 * 1000);
    if (!rateCheck.allowed) {
      logger.warn('Upload init rate limit exceeded', { userId: user.id }, reqId);
      return rateLimitResponse(rateCheck.resetSec);
    }

    const body = await request.json();
    const { filename, contentType, size, title } = body;

    if (!filename || !title || !title.trim()) {
      logger.warn('Upload init missing required metadata', { userId: user.id }, reqId);
      return NextResponse.json({ message: 'Filename and video title are required.' }, { status: 400 });
    }

    // Validation: File size
    if (typeof size === 'number' && size > MAX_FILE_SIZE_BYTES) {
      logger.warn('Upload init size exceeds limit', { filename, size }, reqId);
      return NextResponse.json(
        { message: `File size exceeds 500 MB limit. (Your file: ${(size / (1024 * 1024)).toFixed(1)} MB)` },
        { status: 400 }
      );
    }

    // Validation: MIME type and Extension
    const lowerName = filename.toLowerCase();
    const hasValidExtension = ALLOWED_EXTENSIONS.some((ext) => lowerName.endsWith(ext));
    const mimeStr = (contentType || '').toLowerCase();
    const isVideoMime = mimeStr.startsWith('video/') || mimeStr === 'application/octet-stream' || mimeStr === 'application/mp4';

    if (!hasValidExtension && !isVideoMime) {
      logger.warn('Upload init invalid format', { filename, contentType }, reqId);
      return NextResponse.json(
        { message: 'Invalid video file format. Supported formats: .mp4, .mov, .avi, .mkv, .webm' },
        { status: 400 }
      );
    }

    const safeFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    const objectKey = `uploads/${uuidv4()}-${safeFilename}`;

    const { uploadUrl, minioUrl } = await generatePresignedUploadUrl(objectKey, 3600);

    logger.info('Upload init presigned URL generated', { userId: user.id, objectKey, minioUrl }, reqId);

    return NextResponse.json(
      {
        uploadUrl,
        objectKey,
        publicUrl: minioUrl,
        minioUrl,
        expiresIn: 3600,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    logger.error('Upload init failed', error, {}, reqId);
    const message = error instanceof Error ? error.message : 'Failed to initialize direct video upload.';
    return NextResponse.json({ message }, { status: 500 });
  }
}
