import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL || process.env.SPRING_DATASOURCE_URL;

const pool = new Pool(
  connectionString
    ? { connectionString }
    : {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        user: process.env.DB_USER || process.env.SPRING_DATASOURCE_USERNAME || 'admin',
        password: process.env.DB_PASSWORD || process.env.SPRING_DATASOURCE_PASSWORD || 'password',
        database: process.env.DB_NAME || 'aivideodb',
      }
);

let dbInitialized = false;

export async function initDb() {
  if (dbInitialized) return;
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY,
          email VARCHAR(255) NOT NULL UNIQUE,
          password_hash VARCHAR(255) NOT NULL,
          role VARCHAR(50) NOT NULL,
          api_key VARCHAR(255) UNIQUE,
          created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      ALTER TABLE users ADD COLUMN IF NOT EXISTS api_key VARCHAR(255) UNIQUE;

      CREATE TABLE IF NOT EXISTS videos (
          id UUID PRIMARY KEY,
          user_id UUID NOT NULL,
          title VARCHAR(255) NOT NULL,
          status VARCHAR(50) NOT NULL,
          minio_url VARCHAR(1024) NOT NULL,
          duration INTEGER,
          created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT fk_videos_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS transcripts (
          id UUID PRIMARY KEY,
          video_id UUID NOT NULL UNIQUE,
          content TEXT,
          timestamps JSONB,
          CONSTRAINT fk_transcripts_video FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS summaries (
          id UUID PRIMARY KEY,
          video_id UUID NOT NULL UNIQUE,
          short_summary TEXT,
          detailed_summary TEXT,
          CONSTRAINT fk_summaries_video FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE
      );
    `);
    dbInitialized = true;
  } finally {
    client.release();
  }
}

export async function query(text: string, params?: unknown[]) {
  await initDb();
  return pool.query(text, params);
}

export default pool;
