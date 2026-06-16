import path from 'node:path';

export function join(...parts) {
  return path.join(...parts);
}

export function basename(p) {
  return path.basename(p);
}

export function dirname(p) {
  return path.dirname(p);
}

export function ext(p) {
  return path.extname(p);
}

export function resolve(...parts) {
  return path.resolve(...parts);
}

export function isAbsolute(p) {
  return path.isAbsolute(p);
}
