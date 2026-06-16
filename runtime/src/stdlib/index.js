import * as log from './log.js';
import * as env from './env.js';
import * as discord from './discord.js';
import * as json from './json.js';
import * as utils from './utils.js';
import * as fs from './fs.js';
import * as http from './http.js';
import * as path from './path.js';
import * as crypto from './crypto.js';
import * as math from './math.js';
import * as string from './string.js';
import * as array from './array.js';
import * as colors from './colors.js';
import * as process from './process.js';
import * as test from './test.js';
import * as cli from './cli.js';
import * as db from './db.js';

export const STDLIB_MAP = {
  log,
  env,
  discord,
  json,
  utils,
  fs,
  http,
  path,
  crypto,
  math,
  string,
  array,
  colors,
  process,
  test,
  cli,
  db,
};

export function getStdlib(name) {
  return STDLIB_MAP[name] || null;
}

export function listStdlib() {
  return Object.keys(STDLIB_MAP);
}
