export function trim(s) {
  return String(s).trim();
}

export function upper(s) {
  return String(s).toUpperCase();
}

export function lower(s) {
  return String(s).toLowerCase();
}

export function capitalize(s) {
  s = String(s);
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function split(s, sep) {
  return String(s).split(sep);
}

export function join(arr, sep) {
  return arr.join(sep);
}

export function includes(s, sub) {
  return String(s).includes(sub);
}

export function startsWith(s, sub) {
  return String(s).startsWith(sub);
}

export function endsWith(s, sub) {
  return String(s).endsWith(sub);
}

export function replace(s, from, to) {
  return String(s).replace(from, to);
}

export function slug(s) {
  return String(s)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
}

export function padStart(s, len, ch = ' ') {
  return String(s).padStart(len, ch);
}

export function truncate(s, len) {
  s = String(s);
  return s.length > len ? s.slice(0, len) + '...' : s;
}
