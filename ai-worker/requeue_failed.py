"""
Re-queue any FAILED videos so the worker retries them.
Run once: ./venv/bin/python requeue_failed.py
"""
import psycopg2
import pika
import json

DB_CONFIG = {"host": "localhost", "port": 5432, "user": "admin", "password": "password", "dbname": "aivideodb"}

conn = psycopg2.connect(**DB_CONFIG)
with conn.cursor() as cur:
    cur.execute("SELECT id, title, minio_url FROM videos WHERE status = 'FAILED'")
    failed = cur.fetchall()

if not failed:
    print("No FAILED videos found.")
    conn.close()
    exit(0)

print(f"Found {len(failed)} failed video(s). Re-queueing...")

mq = pika.BlockingConnection(pika.ConnectionParameters(host="localhost"))
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
        # Reset status back to PENDING so UI shows processing
        cur.execute("UPDATE videos SET status = 'PENDING' WHERE id = %s", (str(vid_id),))

conn.commit()
conn.close()
mq.close()
print("Done! All failed videos have been re-queued.")
