let currentLevel = 'info';
const levels = { debug: 0, info: 1, warn: 2, error: 3, fatal: 4 };

export function configure(opts = {}) {
  if (opts.level) currentLevel = opts.level;
}

function shouldLog(level) {
  return levels[level] >= levels[currentLevel];
}

function write(level, msg, ctx) {
  if (!shouldLog(level)) return;
  const prefix = `[${level}]`;
  if (ctx != null) {
    console.log(prefix, msg, ctx);
  } else {
    console.log(prefix, msg);
  }
}

export function debug(msg, ctx) { write('debug', msg, ctx); }
export function info(msg, ctx) { write('info', msg, ctx); }
export function warn(msg, ctx) { write('warn', msg, ctx); }
export function error(msg, ctx) { write('error', msg, ctx); }
export function fatal(msg, ctx) { write('fatal', msg, ctx); }

export function create(name) {
  return {
    debug: (msg, ctx) => debug(`[${name}] ${msg}`, ctx),
    info: (msg, ctx) => info(`[${name}] ${msg}`, ctx),
    warn: (msg, ctx) => warn(`[${name}] ${msg}`, ctx),
    error: (msg, ctx) => error(`[${name}] ${msg}`, ctx),
  };
}
