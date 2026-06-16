export function red(t) { return `\x1b[31m${t}\x1b[0m`; }
export function green(t) { return `\x1b[32m${t}\x1b[0m`; }
export function yellow(t) { return `\x1b[33m${t}\x1b[0m`; }
export function blue(t) { return `\x1b[34m${t}\x1b[0m`; }
export function cyan(t) { return `\x1b[36m${t}\x1b[0m`; }
export function bold(t) { return `\x1b[1m${t}\x1b[0m`; }
export function success(t) { return green(`✓ ${t}`); }
export function error(t) { return red(`✗ ${t}`); }
