import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const dbRes = await query('SELECT 1');
    const isDbHealthy = dbRes.rows.length > 0;

    return NextResponse.json(
      {
        status: isDbHealthy ? 'ok' : 'degraded',
        timestamp: new Date().toISOString(),
        services: {
          database: isDbHealthy ? 'connected' : 'disconnected',
          app: 'healthy',
        },
      },
      { status: isDbHealthy ? 200 : 500 }
    );
  } catch (error: unknown) {
    console.error('Health check error:', error);
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Database connection error',
      },
      { status: 500 }
    );
  }
}
