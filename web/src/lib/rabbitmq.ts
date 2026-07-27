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
    const conn = await amqp.connect(rabbitUrl);
    const channel = await conn.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    const payload = JSON.stringify({ videoId, minioPath });
    const result = channel.sendToQueue(QUEUE_NAME, Buffer.from(payload), { persistent: true });

    setTimeout(async () => {
      await channel.close().catch(() => {});
      await conn.close().catch(() => {});
    }, 500);

    return result;
  } catch (err) {
    console.error('Failed to publish message to RabbitMQ:', err);
    return false;
  }
}
