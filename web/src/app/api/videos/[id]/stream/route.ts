import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
import { getMinioObjectStat, getMinioObjectStream } from '@/lib/minio';
import { Readable } from 'stream';

export async function GET(
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

    const videoRes = await query('SELECT id, user_id, minio_url FROM videos WHERE id = $1', [id]);
    if (videoRes.rows.length === 0) {
      return NextResponse.json({ message: 'Video not found' }, { status: 404 });
    }

    const video = videoRes.rows[0];
    if (video.user_id !== user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const stat = await getMinioObjectStat(video.minio_url);
    const fileSize = stat.size;
    const contentType = stat.metaData?.['content-type'] || 'video/mp4';

    const rangeHeader = request.headers.get('range') || request.headers.get('Range');

    if (rangeHeader) {
      const parts = rangeHeader.replace(/bytes=/, '').split('-');
      let start = parseInt(parts[0], 10);
      let end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      if (isNaN(start)) start = 0;
      if (isNaN(end) || end >= fileSize) end = fileSize - 1;
      if (start > end) {
        start = 0;
        end = fileSize - 1;
      }

      const chunkSize = end - start + 1;
      const nodeStream = await getMinioObjectStream(video.minio_url, start, chunkSize) as Readable;

      const webStream = new ReadableStream({
        start(controller) {
          nodeStream.on('data', (chunk: Buffer) => controller.enqueue(new Uint8Array(chunk)));
          nodeStream.on('end', () => controller.close());
          nodeStream.on('error', (err: Error) => controller.error(err));
        },
        cancel() {
          nodeStream.destroy();
        },
      });

      return new Response(webStream, {
        status: 206,
        headers: {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': String(chunkSize),
          'Content-Type': contentType,
          'Cache-Control': 'private, max-age=3600',
        },
      });
    } else {
      const nodeStream = await getMinioObjectStream(video.minio_url) as Readable;

      const webStream = new ReadableStream({
        start(controller) {
          nodeStream.on('data', (chunk: Buffer) => controller.enqueue(new Uint8Array(chunk)));
          nodeStream.on('end', () => controller.close());
          nodeStream.on('error', (err: Error) => controller.error(err));
        },
        cancel() {
          nodeStream.destroy();
        },
      });

      return new Response(webStream, {
        status: 200,
        headers: {
          'Accept-Ranges': 'bytes',
          'Content-Length': String(fileSize),
          'Content-Type': contentType,
          'Cache-Control': 'private, max-age=3600',
        },
      });
    }
  } catch (error: unknown) {
    console.error('Video stream error:', error);
    const message = error instanceof Error ? error.message : 'Failed to stream video';
    return NextResponse.json({ message }, { status: 500 });
  }
}
