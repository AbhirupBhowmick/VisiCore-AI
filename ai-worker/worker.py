import pika
import json
import time
import os
import uuid
import tempfile
import psycopg2
from psycopg2.extras import Json
from minio import Minio
from google import genai
from google.genai import types

from dotenv import load_dotenv

# Load local environment variables from .env file if it exists
load_dotenv()

# ─── Config ──────────────────────────────────────────────────────────────────

DB_URL = os.environ.get("DATABASE_URL") # Support complete database connection URL
DB_CONFIG = {
    "host": os.environ.get("DB_HOST", "localhost"),
    "port": int(os.environ.get("DB_PORT", 5432)),
    "user": os.environ.get("DB_USER", "admin"),
    "password": os.environ.get("DB_PASSWORD", "password"),
    "dbname": os.environ.get("DB_NAME", "aivideodb")
}

RABBITMQ_URL = os.environ.get("RABBITMQ_URL") # Support CloudAMQP URL
RABBITMQ_HOST = os.environ.get("RABBITMQ_HOST", "localhost")
QUEUE_NAME = "video_processing_queue"

MINIO_ENDPOINT = os.environ.get("MINIO_ENDPOINT", "localhost:9000")
MINIO_ACCESS   = os.environ.get("MINIO_ACCESS", "minioadmin")
MINIO_SECRET   = os.environ.get("MINIO_SECRET", "minioadmin")
MINIO_BUCKET   = os.environ.get("MINIO_BUCKET", "aivideo")
MINIO_SECURE   = os.environ.get("MINIO_SECURE", "false").lower() == "true" or ".supabase.co" in MINIO_ENDPOINT or ".amazonaws.com" in MINIO_ENDPOINT

# Gemini API Key (reads from env or local .env file)
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")

# ─── DB helpers ──────────────────────────────────────────────────────────────

def get_db():
    if DB_URL:
        return psycopg2.connect(DB_URL)
    return psycopg2.connect(**DB_CONFIG)

def update_video_status(video_id, status):
    conn = get_db()
    try:
        with conn.cursor() as cur:
            cur.execute("UPDATE videos SET status = %s WHERE id = %s", (status, video_id))
        conn.commit()
    finally:
        conn.close()

def save_results(video_id, transcript_content, timestamps, short_summary, detailed_summary):
    conn = get_db()
    try:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM transcripts WHERE video_id = %s", (video_id,))
            cur.execute("DELETE FROM summaries WHERE video_id = %s",   (video_id,))
            cur.execute(
                "INSERT INTO transcripts (id, video_id, content, timestamps) VALUES (%s,%s,%s,%s)",
                (str(uuid.uuid4()), video_id, transcript_content, Json(timestamps))
            )
            cur.execute(
                "INSERT INTO summaries (id, video_id, short_summary, detailed_summary) VALUES (%s,%s,%s,%s)",
                (str(uuid.uuid4()), video_id, short_summary, detailed_summary)
            )
            cur.execute("UPDATE videos SET status = 'COMPLETED' WHERE id = %s", (video_id,))
        conn.commit()
    finally:
        conn.close()

def get_video_title(video_id):
    conn = get_db()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT title FROM videos WHERE id = %s", (video_id,))
            row = cur.fetchone()
            return row[0] if row else "Uploaded Video"
    finally:
        conn.close()

# ─── MinIO download ───────────────────────────────────────────────────────────

def download_from_minio(minio_path: str, dest_path: str):
    """Download the video file from MinIO to a local temp path."""
    client = Minio(MINIO_ENDPOINT, access_key=MINIO_ACCESS, secret_key=MINIO_SECRET, secure=MINIO_SECURE)
    
    # Normalize: strip leading slashes, then strip bucket name prefix if present
    object_name = minio_path.lstrip('/')
    if object_name.startswith(MINIO_BUCKET + "/"):
        object_name = object_name[len(MINIO_BUCKET) + 1:]
    object_name = object_name.lstrip('/')
    
    print(f"  Downloading MinIO object: '{object_name}' → {dest_path}")
    client.fget_object(MINIO_BUCKET, object_name, dest_path)

# ─── Gemini AI analysis ───────────────────────────────────────────────────────

TRANSCRIPT_PROMPT = """
You are an expert video transcription and analysis AI.

Analyze this video completely and return a JSON object with EXACTLY this structure:
{
  "transcript": "Full verbatim transcript of everything spoken in the video.",
  "timestamps": [
    {"start": 0, "end": 5, "text": "sentence or phrase spoken from 0-5 seconds"},
    {"start": 5, "end": 10, "text": "next sentence or phrase"},
    ...
  ],
  "short_summary": "1-2 sentence TL;DR summary of the entire video.",
  "detailed_summary": "3-5 paragraph in-depth analysis covering all major topics, key points, and takeaways from this video."
}

Rules:
- Timestamps should cover the ENTIRE video in sequential segments of roughly 5-10 seconds each.
- The text in each timestamp entry must be the ACTUAL words spoken in that time range.
- If there is no speech at a certain time, describe what is visually happening instead.
- Return ONLY the JSON object. Do not add markdown code fences or any other text.
"""

def analyze_video_with_gemini(video_path: str, video_title: str) -> dict:
    """Upload video to Gemini Files API and get real AI analysis."""
    if not GEMINI_API_KEY:
        raise ValueError(
            "GEMINI_API_KEY is not set! Set it as an environment variable:\n"
            "  export GEMINI_API_KEY='your-key-here'\n"
            "Then restart the worker."
        )

    client = genai.Client(api_key=GEMINI_API_KEY)

    # Determine MIME type from file extension
    ext = os.path.splitext(video_path)[1].lower()
    mime_map = {".mp4": "video/mp4", ".webm": "video/webm", ".mov": "video/quicktime",
                ".avi": "video/x-msvideo", ".mkv": "video/x-matroska"}
    mime_type = mime_map.get(ext, "video/mp4")

    # ── Step 1: Upload video to Gemini Files API ──────────────────────────────
    print(f"  Uploading video to Gemini Files API ({mime_type})…")
    video_file = client.files.upload(
        file=video_path,
        config=types.UploadFileConfig(
            mime_type=mime_type,
            display_name=video_title
        )
    )
    print(f"  Upload complete. File URI: {video_file.uri}")

    # ── Step 2: Wait for file to be fully processed ───────────────────────────
    print("  Waiting for Gemini to process video…")
    for _ in range(30):  # max 5 minutes
        file_info = client.files.get(name=video_file.name)
        state = str(file_info.state).upper()
        print(f"    File state: {state}")
        if "ACTIVE" in state:
            break
        if "FAILED" in state:
            raise RuntimeError("Gemini file processing failed")
        time.sleep(10)

    # ── Step 3: Run AI analysis with retry on quota/rate-limit ───────────────
    print("  Running Gemini AI analysis on video content…")
    
    last_error = None
    for attempt in range(4):  # up to 4 tries
        try:
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=[
                    types.Part.from_uri(file_uri=video_file.uri, mime_type=mime_type),
                    TRANSCRIPT_PROMPT
                ]
            )
            break  # success
        except Exception as e:
            last_error = e
            err_str = str(e)
            if "429" in err_str or "RESOURCE_EXHAUSTED" in err_str:
                wait = (attempt + 1) * 30  # 30s, 60s, 90s, 120s
                print(f"  Rate limited (attempt {attempt+1}/4). Waiting {wait}s before retry…")
                time.sleep(wait)
            else:
                raise  # non-quota error, fail immediately
    else:
        raise RuntimeError(f"Gemini API failed after 4 attempts: {last_error}")

    raw = response.text.strip()
    # Strip markdown fences if model added them despite instructions
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
        raw = raw.strip()
        if raw.endswith("```"):
            raw = raw[:-3].strip()

    result = json.loads(raw)

    # ── Step 4: Clean up uploaded file from Gemini ────────────────────────────
    try:
        client.files.delete(name=video_file.name)
    except Exception:
        pass  # Non-critical

    return result

# ─── Message handler ──────────────────────────────────────────────────────────

def process_video_task(ch, method, properties, body):
    payload  = json.loads(body)
    video_id = payload.get("videoId")
    minio_path = payload.get("minioPath")

    print(f"\n{'='*60}")
    print(f"Processing video: {video_id}")
    print(f"MinIO path: {minio_path}")

    try:
        update_video_status(video_id, "PROCESSING")
        video_title = get_video_title(video_id)
        print(f"Video title: {video_title}")

        # Determine file extension from path
        ext = os.path.splitext(minio_path)[1] or ".mp4"

        # Download video to a temp file
        with tempfile.NamedTemporaryFile(suffix=ext, delete=False) as tmp:
            tmp_path = tmp.name

        try:
            download_from_minio(minio_path, tmp_path)
            file_size_mb = os.path.getsize(tmp_path) / (1024 * 1024)
            print(f"  Video downloaded: {file_size_mb:.1f} MB")

            # Run real Gemini AI analysis
            result = analyze_video_with_gemini(tmp_path, video_title)

        finally:
            # Always clean up temp file
            if os.path.exists(tmp_path):
                os.remove(tmp_path)

        # Validate result structure
        transcript   = result.get("transcript", "")
        timestamps   = result.get("timestamps", [])
        short_sum    = result.get("short_summary", "")
        detailed_sum = result.get("detailed_summary", "")

        if not transcript:
            raise ValueError("Gemini returned empty transcript")

        print(f"  Analysis complete:")
        print(f"    Transcript length: {len(transcript)} chars")
        print(f"    Timestamps:        {len(timestamps)} segments")
        print(f"    Short summary:     {short_sum[:80]}…")

        save_results(video_id, transcript, timestamps, short_sum, detailed_sum)
        print(f"  ✅ Video {video_id} fully processed and saved!")

    except ValueError as e:
        # Configuration error (missing API key etc.) — log but don't retry
        print(f"  ❌ Config error: {e}")
        update_video_status(video_id, "FAILED")

    except Exception as e:
        print(f"  ❌ Processing error: {e}")
        import traceback
        traceback.print_exc()
        try:
            update_video_status(video_id, "FAILED")
        except Exception:
            pass

    finally:
        ch.basic_ack(delivery_tag=method.delivery_tag)

# ─── Main ─────────────────────────────────────────────────────────────────────

def main():
    if not GEMINI_API_KEY:
        print("=" * 60)
        print("⚠️  WARNING: GEMINI_API_KEY is not set!")
        print("   The worker will fail for every video until you set it.")
        print("   Run: export GEMINI_API_KEY='your-key-here'")
        print("   Then restart: ./venv/bin/python worker.py")
        print("=" * 60)

    print("Connecting to RabbitMQ…")
    if RABBITMQ_URL:
        params = pika.URLParameters(RABBITMQ_URL)
    else:
        params = pika.ConnectionParameters(host=RABBITMQ_HOST)
    connection = pika.BlockingConnection(params)
    channel = connection.channel()
    channel.queue_declare(queue=QUEUE_NAME, durable=True)
    channel.basic_qos(prefetch_count=1)
    channel.basic_consume(queue=QUEUE_NAME, on_message_callback=process_video_task)

    print(f"[*] Waiting for videos on '{QUEUE_NAME}'. Press CTRL+C to stop.\n")
    channel.start_consuming()

if __name__ == "__main__":
    main()
