import * as http from 'http';
import path from 'path';
import App from './app';
import config from 'dotenv';

config.config({ path: path.join(__dirname, '.env') });

const port = process.env.API_PORT || 3070;

declare global {
  var DIR_ROOT: string;
}

global.DIR_ROOT = __dirname;

App.set('port', port);
const server = http.createServer(App);
server.listen(port);

module.exports = App;
