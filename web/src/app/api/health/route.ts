import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { minioClient, BUCKET_NAME } from '@/lib/minio';

export async function GET() {
  try {
    // 1. PostgreSQL check
    let isDbHealthy = false;
    try {
      const dbRes = await query('SELECT 1');
      isDbHealthy = dbRes.rows.length > 0;
    } catch {
      isDbHealthy = false;
    }

    // 2. MinIO check
    let isMinioHealthy = false;
    try {
      isMinioHealthy = await minioClient.bucketExists(BUCKET_NAME).catch(() => false);
    } catch {
      isMinioHealthy = false;
    }

    // 3. Gemini API Key check
    const isGeminiConfigured = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_google_gemini_api_key_here';

    const isSystemHealthy = isDbHealthy && isMinioHealthy;

    return NextResponse.json(
      {
        status: isSystemHealthy ? 'ok' : 'degraded',
        timestamp: new Date().toISOString(),
        services: {
          database: isDbHealthy ? 'connected' : 'disconnected',
          storage: isMinioHealthy ? 'connected' : 'degraded',
          geminiAi: isGeminiConfigured ? 'configured' : 'missing_api_key',
          app: 'healthy',
        },
      },
      { status: isSystemHealthy ? 200 : 503 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Health check failed',
      },
      { status: 500 }
    );
  }
}
