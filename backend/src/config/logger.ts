import pino from 'pino';
import pretty from 'pino-pretty';
import { existsSync, mkdirSync } from 'fs';

if (!existsSync(`${global.DIR_ROOT}/logs`)) {
  mkdirSync(`${global.DIR_ROOT}/logs`);
}

const createSonicBoom = (dest: string) => pino.destination({ dest: dest, append: true, sync: true });

const streams = [
  { stream: createSonicBoom(`${global.DIR_ROOT}/logs/latest.log`) },
  {
    stream: pretty({
      colorize: true,
      sync: true,
    }),
  },
];

const logger = pino(
  {
    level: process.env.LOG_LEVEL || 'info',
    formatters: {
      level: (label) => {
        return { level: label.toUpperCase() };
      },
    },
    timestamp: pino.stdTimeFunctions.isoTime,
    base: undefined,
  },
  pino.multistream(streams),
);
logger.info('Pino logger initialized');

export default logger;
