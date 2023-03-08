declare global {
  /* eslint-disable no-var */
  var DIR_ROOT: string;
}

global.DIR_ROOT = __dirname;

import * as http from 'http';
import path from 'path';
import App from './app';
import config from 'dotenv';
config.config({ path: path.join(global.DIR_ROOT, '.env') });

import logger from './config/logger';

const port = process.env.API_PORT || 3070;

const pad = (num: number) => (num > 9 ? '' : '0') + num;
/* eslint-disable @typescript-eslint/no-explicit-any */
const generator = (time: any, index: any): string => {
  if (!time) return `latest.log`;

  const month = time.getFullYear() + '' + pad(time.getMonth() + 1);
  const day = pad(time.getDate());
  const hour = pad(time.getHours());
  const minute = pad(time.getMinutes());

  return `${month}${day}-${hour}${minute}-${index}.log`;
};

import { createStream } from 'rotating-file-stream';
createStream(generator, {
  size: '10M',
  interval: '1d',
  path: `${global.DIR_ROOT}/logs/`,
  maxFiles: 7,
});

App.set('port', port);
const server = http.createServer(App);
server.listen(port);

logger.info(`MemeManager API started on port ${port}`);

module.exports = App;
