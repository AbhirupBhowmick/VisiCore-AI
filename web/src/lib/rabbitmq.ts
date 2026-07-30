import amqp from 'amqplib';

export const QUEUE_NAME = 'video_processing_queue';

function getRabbitMQUrl(): string {
  if (process.env.RABBITMQ_URL) {
    return process.env.RABBITMQ_URL;
  }
  if (process.env.SPRING_RABBITMQ_ADDRESSES) {
    return process.env.SPRING_RABBITMQ_ADDRESSES;
  }
  const host = process.env.RABBITMQ_HOST || 'localhost';
  const port = process.env.RABBITMQ_PORT || '5672';
  const user = process.env.RABBITMQ_USER || 'guest';
  const pass = process.env.RABBITMQ_PASS || 'guest';
  return `amqp://${user}:${pass}@${host}:${port}`;
}

export async function publishVideoTask(videoId: string, minioPath: string): Promise<boolean> {
  const rabbitUrl = getRabbitMQUrl();
  try {
    console.log(`[RabbitMQ] Publishing RabbitMQ message for videoId: ${videoId}`);
    const conn = await amqp.connect(rabbitUrl);
    const channel = await conn.createConfirmChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    const payload = JSON.stringify({ videoId, minioPath });

    await new Promise<void>((resolve, reject) => {
      channel.sendToQueue(
        QUEUE_NAME,
        Buffer.from(payload),
        { persistent: true },
        (err) => {
          if (err) {
            console.error('[RabbitMQ] Broker failed/rejected message:', err);
            reject(err);
          } else {
            console.log('[RabbitMQ] RabbitMQ broker acknowledged publish');
            resolve();
          }
        }
      );
    });

    console.log('[RabbitMQ] Closing RabbitMQ channel');
    await channel.close().catch(() => {});
    console.log('[RabbitMQ] RabbitMQ connection closed');
    await conn.close().catch(() => {});

    return true;
  } catch (err) {
    console.error('Failed to publish message to RabbitMQ:', err);
    return false;
  }
}
