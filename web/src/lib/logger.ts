import { v4 as uuidv4 } from 'uuid';

export type LogLevel = 'info' | 'warn' | 'error';

export interface LogPayload {
  level: LogLevel;
  message: string;
  reqId?: string;
  context?: Record<string, unknown>;
  error?: unknown;
}

export function generateRequestId(): string {
  return `req_${uuidv4().replace(/-/g, '').slice(0, 12)}`;
}

export const logger = {
  info(message: string, context?: Record<string, unknown>, reqId?: string) {
    logFormatted({ level: 'info', message, context, reqId });
  },
  warn(message: string, context?: Record<string, unknown>, reqId?: string) {
    logFormatted({ level: 'warn', message, context, reqId });
  },
  error(message: string, error?: unknown, context?: Record<string, unknown>, reqId?: string) {
    logFormatted({ level: 'error', message, error, context, reqId });
  },
};

function logFormatted({ level, message, context, error, reqId }: LogPayload) {
  const timestamp = new Date().toISOString();
  const errMessage = error instanceof Error ? error.message : (error ? String(error) : undefined);
  const stack = error instanceof Error ? error.stack : undefined;

  const logEntry = {
    timestamp,
    level,
    reqId: reqId || 'system',
    message,
    ...(context ? { context } : {}),
    ...(errMessage ? { error: errMessage } : {}),
    ...(stack ? { stack } : {}),
  };

  const output = JSON.stringify(logEntry);
  if (level === 'error') {
    console.error(output);
  } else if (level === 'warn') {
    console.warn(output);
  } else {
    console.log(output);
  }
}
