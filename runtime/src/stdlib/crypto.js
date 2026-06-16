import crypto from 'node:crypto';

export function md5(text) {
  return crypto.createHash('md5').update(text).digest('hex');
}

export function sha256(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

export function randomBytes(n = 32) {
  return crypto.randomBytes(n).toString('hex');
}

export function uuid() {
  return crypto.randomUUID();
}

export function hash(algo, text) {
  return crypto.createHash(algo).update(text).digest('hex');
}
