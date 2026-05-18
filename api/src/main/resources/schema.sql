CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

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
