export function now() {
  return Date.now();
}

export function isoNow() {
  return new Date().toISOString();
}

export function parseInt(text, base = 10) {
  return Number.parseInt(text, base);
}

export function isEmail(text) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);
}

export function isNumber(val) {
  return typeof val === 'number' && !Number.isNaN(val);
}

export function isEmpty(val) {
  return val == null || val === '' || (Array.isArray(val) && val.length === 0);
}

export async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
