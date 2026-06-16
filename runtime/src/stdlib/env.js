export function get(key, defaultValue = null) {
  const val = process.env[key];
  if (val === undefined || val === null || val === '') {
    return defaultValue;
  }
  return val;
}

export function getInt(key, defaultValue = 0) {
  const val = get(key);
  if (val === null) return defaultValue;
  const n = parseInt(val, 10);
  return Number.isNaN(n) ? defaultValue : n;
}

export function getBool(key, defaultValue = false) {
  const val = get(key);
  if (val === null) return defaultValue;
  return val === 'true' || val === '1' || val === 'yes';
}

export function set(key, value) {
  process.env[key] = String(value);
}

export function require(key) {
  const val = get(key);
  if (val === null) {
    throw new Error(`Missing required env var: ${key}`);
  }
  return val;
}
