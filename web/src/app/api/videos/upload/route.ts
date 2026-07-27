import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { query } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
import { uploadToMinio } from '@/lib/minio';
import { publishVideoTask } from '@/lib/rabbitmq';

export async function POST(request: Request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const title = formData.get('title') as string | null;

    if (!file || !title) {
      return NextResponse.json({ message: 'File and title are required' }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const objectName = `${uuidv4()}-${file.name}`;
    const minioUrl = await uploadToMinio(objectName, fileBuffer, file.type || 'video/mp4');

    const videoId = uuidv4();
    const now = new Date();

    await query(
      'INSERT INTO videos (id, user_id, title, status, minio_url, created_at) VALUES ($1, $2, $3, $4, $5, $6)',
      [videoId, user.id, title, 'UPLOAD_PENDING', minioUrl, now]
    );

    // Enqueue for processing by Python AI Worker
    await publishVideoTask(videoId, minioUrl);

    const videoDto = {
      id: videoId,
      title: title,
      status: 'UPLOAD_PENDING',
      minioUrl: minioUrl,
      duration: null,
      createdAt: now.toISOString(),
      transcript: null,
      summary: null,
    };

    return NextResponse.json(videoDto, { status: 200 });
  } catch (error: unknown) {
    console.error('Upload video error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ message }, { status: 500 });
  }
}
