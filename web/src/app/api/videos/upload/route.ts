import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    {
      message: 'Direct multipart upload through Next.js serverless route is deprecated to prevent Vercel 413 Payload Too Large limits. Please use /api/videos/upload/init and /api/videos/upload/complete for presigned direct R2/S3 uploads.',
    },
    { status: 410 }
  );
}
