import { Client as MinioClient } from 'minio';

const minioUrl = process.env.MINIO_URL || process.env.MINIO_ENDPOINT || 'http://localhost:9000';
const accessKey = process.env.MINIO_ACCESS_KEY || process.env.MINIO_ACCESS || 'minioadmin';
const secretKey = process.env.MINIO_SECRET_KEY || process.env.MINIO_SECRET || 'minioadmin';
export const BUCKET_NAME = process.env.MINIO_BUCKET || 'aivideo';

let endPoint = 'localhost';
let port = 9000;
let useSSL = false;

try {
  if (minioUrl.startsWith('http://') || minioUrl.startsWith('https://')) {
    const parsed = new URL(minioUrl);
    endPoint = parsed.hostname;
    port = parsed.port ? parseInt(parsed.port, 10) : (parsed.protocol === 'https:' ? 443 : 80);
    useSSL = parsed.protocol === 'https:';
  } else {
    const parts = minioUrl.split(':');
    endPoint = parts[0];
    if (parts.length > 1) {
      port = parseInt(parts[1], 10);
    }
    useSSL = process.env.MINIO_SECURE === 'true' || endPoint.includes('.supabase.co') || endPoint.includes('.amazonaws.com');
  }
} catch {
  // Fallback defaults
}

export const minioClient = new MinioClient({
  endPoint,
  port,
  useSSL,
  accessKey,
  secretKey,
});

export async function uploadToMinio(objectName: string, buffer: Buffer, contentType: string): Promise<string> {
  const exists = await minioClient.bucketExists(BUCKET_NAME).catch(() => false);
  if (!exists) {
    await minioClient.makeBucket(BUCKET_NAME, 'us-east-1').catch(() => {});
  }

  await minioClient.putObject(BUCKET_NAME, objectName, buffer, buffer.length, {
    'Content-Type': contentType,
  });

  return `/${BUCKET_NAME}/${objectName}`;
}

export async function deleteFromMinio(objectName: string): Promise<void> {
  try {
    await minioClient.removeObject(BUCKET_NAME, objectName);
  } catch (err) {
    console.warn(`Failed to delete object ${objectName} from MinIO:`, err);
  }
}

export async function getMinioObjectStat(objectName: string) {
  const cleanName = objectName.replace(new RegExp(`^/?${BUCKET_NAME}/?`), '').replace(/^\//, '');
  return minioClient.statObject(BUCKET_NAME, cleanName);
}

export async function getMinioObjectStream(objectName: string, offset?: number, length?: number) {
  const cleanName = objectName.replace(new RegExp(`^/?${BUCKET_NAME}/?`), '').replace(/^\//, '');
  if (typeof offset === 'number' && typeof length === 'number') {
    return minioClient.getPartialObject(BUCKET_NAME, cleanName, offset, length);
  }
  return minioClient.getObject(BUCKET_NAME, cleanName);
}

export async function generatePresignedUploadUrl(objectName: string, expiresInSeconds: number = 3600): Promise<{ uploadUrl: string; objectKey: string; minioUrl: string }> {
  const cleanKey = objectName.replace(new RegExp(`^/?${BUCKET_NAME}/?`), '').replace(/^\//, '');
  const exists = await minioClient.bucketExists(BUCKET_NAME).catch(() => false);
  if (!exists) {
    await minioClient.makeBucket(BUCKET_NAME, 'us-east-1').catch(() => {});
  }

  const uploadUrl = await minioClient.presignedPutObject(BUCKET_NAME, cleanKey, expiresInSeconds);
  const minioUrl = `/${BUCKET_NAME}/${cleanKey}`;
  return { uploadUrl, objectKey: cleanKey, minioUrl };
}
