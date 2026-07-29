"""
Re-queue any FAILED videos so the worker retries them.
Run once: python requeue_failed.py
"""
import os
import psycopg2
import pika
import json
from dotenv import load_dotenv

load_dotenv()

DB_URL = os.environ.get("DATABASE_URL")
DB_CONFIG = {
    "host": os.environ.get("DB_HOST", "localhost"),
    "port": int(os.environ.get("DB_PORT", 5432)),
    "user": os.environ.get("DB_USER", "admin"),
    "password": os.environ.get("DB_PASSWORD", "password"),
    "dbname": os.environ.get("DB_NAME", "aivideodb")
}

RABBITMQ_URL = os.environ.get("RABBITMQ_URL")
RABBITMQ_HOST = os.environ.get("RABBITMQ_HOST", "localhost")

if DB_URL:
    conn = psycopg2.connect(DB_URL)
else:
    conn = psycopg2.connect(**DB_CONFIG)

with conn.cursor() as cur:
    cur.execute("SELECT id, title, minio_url FROM videos WHERE status = 'FAILED'")
    failed = cur.fetchall()

if not failed:
    print("No FAILED videos found.")
    conn.close()
    exit(0)

print(f"Found {len(failed)} failed video(s). Re-queueing...")

if RABBITMQ_URL:
    params = pika.URLParameters(RABBITMQ_URL)
else:
    params = pika.ConnectionParameters(host=RABBITMQ_HOST)

mq = pika.BlockingConnection(params)
ch = mq.channel()
ch.queue_declare(queue="video_processing_queue", durable=True)

with conn.cursor() as cur:
    for vid_id, title, minio_url in failed:
        print(f"  Re-queueing: {title} ({vid_id})")
        payload = json.dumps({"videoId": str(vid_id), "minioPath": minio_url or ""})
        ch.basic_publish(
            exchange="",
            routing_key="video_processing_queue",
            body=payload,
            properties=pika.BasicProperties(delivery_mode=2)
        )
        # Reset status back to UPLOAD_PENDING so UI shows processing
        cur.execute("UPDATE videos SET status = 'UPLOAD_PENDING' WHERE id = %s", (str(vid_id),))

conn.commit()
conn.close()
mq.close()
print("Done! All failed videos have been re-queued.")
