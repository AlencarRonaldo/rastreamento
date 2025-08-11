/**
 * Logger utility with SuperClaude integration
 * Logging system with structured logging and analytics
 */

import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname'
    }
  },
  base: {
    service: 'vehicle-tracking-backend',
    version: '1.0.0'
  }
});

export { logger };