import pino from 'pino';

// Create a singleton Pino logger instance with sensible defaults.
// Adjust the destination or level via environment variables if needed.
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport:
    process.env.NODE_ENV !== 'production'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
          },
        }
      : undefined,
});

export default logger;
