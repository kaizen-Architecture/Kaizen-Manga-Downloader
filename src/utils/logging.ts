import path from 'path';
import pino from 'pino';
import fs from 'fs';

const getLogDir = () => {
  if (typeof process !== 'undefined') {
    if (process.env.KAIZEN_LOG_PATH) return process.env.KAIZEN_LOG_PATH;
    if (process.env.KAIZOKU_LOG_PATH) return process.env.KAIZOKU_LOG_PATH;
  }
  if (fs.existsSync('/logs')) return '/logs';
  return '';
};

export const logger = pino({
  level: 'debug',
  transport: {
    targets: [
      {
        target: 'pino-pretty',
        level: 'debug',
        options: {
          levelFirst: false,
          destination: 1,
          translateTime: true,
          colorize: true,
        },
      },
      {
        target: 'pino/file',
        level: 'debug',
        options: {
          destination: path.resolve(getLogDir(), 'kaizen.log'),
        },
      },
    ],
  },
});
